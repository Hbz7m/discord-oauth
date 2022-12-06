var CryptoJS = require("crypto-js");

const key = process.env["SECRET_KEY"];

async function encrypt(token){
  return CryptoJS.AES.encrypt(token, process.env["SECRET_KEY"]).toString();
}
async function decrypt(token){
  return CryptoJS.AES.decrypt(token, process.env["SECRET_KEY"]);
}

module.exports = { encrypt, decrypt }