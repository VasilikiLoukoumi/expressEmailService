const express = require('express');
const mailer = require('express-mailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');﻿


//install body-parser to use POST
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {    
    res.render(`${__dirname}/views/index`, { qs: req.query });
    
});

// POST 
app.post('/', urlencodedParser, (req, res) => {
    console.log(req.body);
    res.render(`${__dirname}/views/form`, { data: req.body });
 
}); 

app.get('/new', (req, res) => {
    res.render(`${__dirname}/views/form`);
});

app.get('/feedback', (req, res) => {
    res.render(`${__dirname}/views/feedback`);
});


app.listen(port, () => console.log(`Server listening on port ${port}.`));

