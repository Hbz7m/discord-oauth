const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
require('./strategies/discord');
const { encrypt, decrypt } = require('./utils/helpers.js');
const expres_session = require('express-session')

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
app.use(expres_session({
  secret: process.env["SECRET_KEY"],
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

app.use(session({
        store: new MemoryStore({checkPeriod: 86400000 }),
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
  res.status(200).send("OK")
})
                                 
app.listen('8000', () => {
  mongoose.connect(process.env["MONGO"]);
  const encrypted = encrypt("fortnite");
  const decrypted = decrypt(encrypted);
  console.log(encrypted, decrypted)
  console.log("Backend is online")
})