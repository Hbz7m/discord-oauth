const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
require('./strategies/discord');
const { encrypt, decrypt } = require('./utils/helpers.js');
const session = require("express-session");
const MongoStore = require("connect-mongo")
const jwt = require('jsonwebtoken');

const { QuickDB } = require('quick.db');
const db = new QuickDB(); // using default driver

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
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env["MONGO"],
    ttl: 4 * 24 * 60 * 60 // = 4 days
  }),
  secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.get(`/discord/login`, passport.authenticate("discord"), (req, res) => {
  res.send(200)
});
app.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/discord/login'
}), function(req, res) {
  res.redirect('/discord/profile') // Successful auth
});

app.get('/discord/profile', (req, res) => {
  if (!req.user) {
    res.redirect('/discord/login')
  } else {
    const data = req.user;
    res.json(data);
  }
})

app.get('/discord/@me', (req, res) => {
  if (!req.user) {
    res.redirect('/discord/login');
  } else {
    const accessToken = jwt.verify(req.user.accessToken, process.env["SECRET_KEY"]);
    const refreshToken = jwt.verify(req.user.refreshToken, process.env["SECRET_KEY"]);
    res.json({ "accessToken": accessToken, "refreshToken": refreshToken });
  }
})

app.post('/discord/ban', async(req, res) => {
  const user = req.query.userId;
  const ownerToken = req.body.token || req.query.token || req.headers.token;
  if(!user|| !ownerToken) return res.json({ msg: "No informations provided" });
  if(!ownerToken === process.env["token"]) return res.send("Unauthorized");
  const banned = await db.get(user);
  if (banned){
    return res.json({ msg: "User is already banned!" })
  } else {
    await db.set(user, true);
    return res.json({ msg: "User got successfully banned!" })
  }
});

app.post('/discord/unban', async(req, res) => {
    const user = req.query.userId;
  const ownerToken = req.body.token || req.query.token || req.headers.token;
  if(!user|| !ownerToken) return res.json({ msg: "No informations provided" });
  if(!ownerToken === process.env["token"]) return res.send("Unauthorized");
  const banned = await db.get(user);
  if (!banned){
    return res.json({ msg: "User is not banned!" })
  } else {
    await db.delete(user);
    return res.json({ msg: "User got successfully banned!" })
  }
});

app.listen('8000', () => {
  mongoose.connect(process.env["MONGO"]);
  console.log("Backend is online")
})