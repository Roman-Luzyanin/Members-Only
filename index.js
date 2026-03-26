require('dotenv').config();
const path = require('path');
const passport = require("passport");
const session = require("express-session");
const express = require("express");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));

require('./passport')(passport); 
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.message = req.session.messages;
    delete req.session.messages;
    next();
});

app.use('/', require('./router'));

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('Running on port 3000');
})