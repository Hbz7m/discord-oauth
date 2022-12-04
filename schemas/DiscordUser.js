const mongoose = require('mongoose');

const DiscordUser = new mongoose.Schema({
  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  username: String,
  discriminator: String,
  tag: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  avatar: String,
  guilds: Array,
});

module.exports = mongoose.model("discord_users", DiscordUser)