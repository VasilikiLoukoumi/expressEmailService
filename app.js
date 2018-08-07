const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();
const port = 3000;

app.use('/styles', express.static('styles'));
app.use('/moduleBoo', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/moduleJQ', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/modulePop', express.static(__dirname + '/node_modules/popper.js/dist/umd/'));
app.use('/scripts', express.static('scripts'));
app.use(expressValidator());
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');﻿


app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {    
    res.render(`${__dirname}/views/index`);
    
});

app.post('/form', (req, res) => {    
   
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;

    req.checkBody('useremail', 'Email is required.').notEmpty();
    req.checkBody('userpassword', 'Password is required.').notEmpty();
    req.checkBody("useremail", "Please enter a valid email address.").isEmail();
    var errors = req.validationErrors();
    if (errors) {     
        res.render(`${__dirname}/views/userValidation`, { data: errors });   
    }
    else {
        res.render(`${__dirname}/views/form`, { data: req.body });   
    }
 }); 


app.get('/form', (req, res) => {
 res.render(`${__dirname}/views/form`);
});

app.get('/feedback', (req, res) => {
    res.render(`${__dirname}/views/feedback`);
});

app.get('/userValidation', (req, res) => {
    res.render(`${__dirname}/views/userValidation`);
});

app.get('/messageValidation', (req, res) => {
    res.render(`${__dirname}/views/messageValidation`);
});

app.post('/feedback', function (req, res) {
    var host = getHost(req.body.myemail);
    var hostname = host.substr(0, host.indexOf('.'));

    //Validate
    req.checkBody("email", "Please enter a valid email address.").isEmail();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('subject', 'Subject is required.').notEmpty();
    req.checkBody('msg', 'Message is required.').notEmpty();

    var errors = req.validationErrors();
   
    if (errors) {
        res.render(`${__dirname}/views/messageValidation`, { data: errors });
    }
    else {
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
            let data = "";
            if (error) {
                data = error;
                res.render(`${__dirname}/views/feedback`, { data: data });
            }
            else {
                data = "Message sent";
                res.render(`${__dirname}/views/feedback`, { data: data });
            }
        });
    }
});


function getHost(str) {
    return str.split('@')[1];
}


app.listen(port, () => console.log(`Server listening on port ${port}.`));

