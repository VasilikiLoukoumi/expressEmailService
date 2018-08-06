const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');﻿


app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {    
    res.render(`${__dirname}/views/index`);
    
});

app.post('/form', (req, res) => {    
    res.render(`${__dirname}/views/form`, { data: req.body });   
}); 


app.get('/form', (req, res) => {
 res.render(`${__dirname}/views/form`);
});

app.get('/feedback', (req, res) => {
    res.render(`${__dirname}/views/feedback`);
});

app.post('/feedback', function (req, res) {
    var host = getHost(req.body.myemail);
    var hostname = host.substr(0, host.indexOf('.'));

    let transporter = nodeMailer.createTransport({
        service: hostname,
        port: 465,
        secure: false,
        auth: {
            user: req.body.myemail,
            pass: req.body.mypass
        }
    });
    let mailOptions = {
        from: req.body.myemail, 
        to: req.body.email, 
        subject: req.body.subject, 
        text: req.body.msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        var data = "";
        if (error) {
            data = error;
            res.render(`${__dirname}/views/feedback`, {data: data});
        }
        data = "Message sent";
        res.render(`${__dirname}/views/feedback`, { data: data });
    });
});


function getHost(str) {
    return str.split('@')[1];
}


app.listen(port, () => console.log(`Server listening on port ${port}.`));

