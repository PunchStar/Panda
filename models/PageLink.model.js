var mongoose = require('mongoose');

var PageLinkSchema = new mongoose.Schema({
    banner: {
        image: {type: String, default: ""},
        url: {type: String, default: ""},
    },
    terms: {type: String, default: ""},
    privacy: {type: String, default: ""},
    contact: {type: String, default: ""},
});

var PageLink = mongoose.model('PageLink', PageLinkSchema);

module.exports = PageLink;
