var CryptoJS = require("crypto-js");

const key = process.env["SECRET_KEY"];

async function encrypt(token){
  const encrypted = CryptoJS.AES.encrypt(token, key).toString();
  return encrypted.toString();
}

async function decrypt(token){
  var bytes  = CryptoJS.AES.decrypt(token, key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText.toString();
}

module.exports = { encrypt, decrypt }