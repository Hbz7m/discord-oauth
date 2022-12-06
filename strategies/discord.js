var DiscordStrategy = require('passport-discord').Strategy
  , refresh = require('passport-oauth2-refresh');
const passport = require('passport');
const mongoose = require('mongoose');
const DiscordUser = require('../schemas/DiscordUser.js');
const jwt = require('jsonwebtoken');


const { QuickDB } = require('quick.db');
const db = new QuickDB(); // using default driver

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.serializeUser((user, done) => {
  if(checkBan(user.discordId)) return done("You are banned", null)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  if(checkBan(user.discordId)) return done("You are banned", null)
  done(null, user)
})

async function checkBan(userId){
  const banned = await db.get(userId);
  if(banned){
    return true
  } else {
    return false
  }
}

var discordStrat = passport.use(new DiscordStrategy({
    clientID: '1044716282311888909',
    clientSecret: process.env["CLIENT_SECRET"],
    callbackURL: process.env["CALLBACK_URL"],
    scope: scopes
},
async (accessToken, refreshToken, profile, done) => {
  try {
    if(checkBan(profile.id)) return done("You are banned", null)
    const discordUser = await DiscordUser.findOne({ discordId: profile.id });
    if(discordUser) {
      await DiscordUser.deleteOne({ discordId: profile.id });
      const newUser = await DiscordUser.create({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        tag: `${profile.username}#${profile.discriminator}`,
        email: profile.email,
        accessToken: jwt.sign(accessToken, process.env["SECRET_KEY"]),
        refreshToken: jwt.sign(refreshToken, process.env["SECRET_KEY"]),
        avatar: profile.avatar,
       guilds: profile.guilds
      });  
      console.log("Deleted and created new user")
      return done(null, newUser);
    } else {
      if(checkBan(profile.id)) return done("You are banned", null)
      const newUser = await DiscordUser.create({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        tag: `${profile.username}#${profile.discriminator}`,
        email: profile.email,
        accessToken: jwt.sign(accessToken, process.env["SECRET_KEY"]),
        refreshToken: jwt.sign(refreshToken, process.env["SECRET_KEY"]),
        avatar: profile.avatar,
       guilds: profile.guilds
      });  
      return done(null, newUser);
    }
  } catch(err){
    return done(err, null)
  }
}))