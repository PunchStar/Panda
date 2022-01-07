var mongoose = require('mongoose');

var ShortCutSchema = new mongoose.Schema({
    key: { type: String, default: ""},
    value: { type: String, default: ""},
});

var ShortCut = mongoose.model('ShortCut', ShortCutSchema);

module.exports = ShortCut;
