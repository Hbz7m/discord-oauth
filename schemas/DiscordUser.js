const mongoose = require('mongoose');

const DiscordUser = new mongoose.Schema({
  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  email: String,
  verified: Boolean,
  accessToken: String,
  refreshToken: String,
  avatar: String,
  username: String,
  discriminator: String,
  tag: String,
  guilds: Array
});

module.exports = mongoose.model("discord_users", DiscordUser)