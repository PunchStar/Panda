var mongoose = require('mongoose');
jwt = require('jsonwebtoken');
crypto = require('crypto');
const IV_LENGTH = 16; // For AES, this is always 16

var Config = require('../config/config');

var UserSchema = new mongoose.Schema({
    fullName: {type: String, default: "" },
    address: {type: String, default: "" },
    phoneNumber: {type: String, default: "" },
    email: {type: String, default: "" },
    password: {type: String, default: "" },
    companyName: {type: String, default: "" },
    fico: {type: Number, default: 0},
    bankName: {type: String, default: "" },
    accountNumber: {type: String, default: "" },
    routingNumber: {type: String, default: "" },
    zelle: {type: String, default: "" },
    driverLicense: {
        file: { type: String, default: ""},
        state: { type: Number, default: 0},     // 0: Please Upload, 1: Pending, 2: Approved, 3: Not Available
    },
    social: {
        file: { type: String, default: ""},
        state: { type: Number, default: 0},
    },
    passport: {
        file: { type: String, default: ""},
        state: { type: Number, default: 0},
    },
    tax: {
        files: [{ type: String, default: ""}],
        state: { type: Number, default: 0},
    },
    statement: {
        files: [{ type: String, default: ""}],
        state: { type: Number, default: 0},
    },
    utility: {
        file: { type: String, default: ""},
        state: { type: Number, default: 0},
    },
    phoneBill: {
        file: { type: String, default: ""},
        state: { type: Number, default: 0},
    },
    additionalDoc: {
        files: [{ type: String, default: ""}],
        state: { type: Number, default: 0},
    },
    amountMonth: { type: Number, default: 0},
    managementFee: { type: Number, default: 0},
    referer: { type: String, default: ""},
    notes: { type: String, default: ""},
    registeredTime: {type: Date, default: Date.now },
    status: {type: Number, default: 0},         // 0: Active, 1: Pending Closure, Closed
});

UserSchema.methods.setPassword = function(password) {
    let salt =  Config.salt;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    this.password = iv.toString('hex') + 'g' + encrypted.toString('hex');
};

UserSchema.methods.getPassword = function() {

    let salt = Config.salt;
    let textParts = this.password.split('g');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join('g'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(salt), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
}

UserSchema.methods.validatePassword = function(password) {
    return this.getPassword() === password;

};

UserSchema.methods.generateJwt = function() {
    return jwt.sign({
          _id: this._id,
          username: this.fullName,
          exp: 31556926     //1 year in seconds
        },
        Config.secretKey);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
