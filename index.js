const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
require('./strategies/discord');
const { encrypt, decrypt } = require('./utils/helpers.js');

mongoose.connection.on("connected", () => {
  console.log("Connected to Database")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

app.use(session({
        store: store: MongoStore.create({ mongoUrl: process.env["MONGO"] }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))



app.get(`/discord/login`, passport.authenticate("discord"), (req, res) => {
  res.send(200)
});
app.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/discord/login'
}), function(req, res) {
    res.redirect('/discord/profile') // Successful auth
});

app.get('/discord/profile', (req, res) => {
  if(!req.user){
    res.redirect('/discord/login')
  } else {
  const data = req.user
  const { accessToken } = req.user;
  console.log(accessToken);
  res.json(data);
  }
})
                                 
app.listen('8000', () => {
  mongoose.connect(process.env["MONGO"]);
  console.log(encrypt('fortnite'))
  console.log("Backend is online")
})