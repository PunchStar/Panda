var mongoose = require('mongoose');
jwt = require('jsonwebtoken');
crypto = require('crypto');
const IV_LENGTH = 16; // For AES, this is always 16

var Config = require('../config/config');

var AdminSchema = new mongoose.Schema({
    email: {type: String, required: true },
    password: {type: String, required: true },
    avatar: {type: String, default: "" },
    incomeRedger: {type: Number, default: 0 },
    expensiveRedger: {type: Number, default: 0 },
});

AdminSchema.methods.setPassword = function(password) {
    let salt =  Config.salt;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    this.password = iv.toString('hex') + 'g' + encrypted.toString('hex');
};

AdminSchema.methods.getPassword = function() {

    let salt = Config.salt;
    let textParts = this.password.split('g');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join('g'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
}

AdminSchema.methods.validatePassword = function(password) {
    return this.getPassword() === password;
};

AdminSchema.methods.generateJwt = function() {
    return jwt.sign({
          _id: this._id,
          username: "admin",
          exp: 31556926     //1 year in seconds
        },
        "secretKey");
};

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
