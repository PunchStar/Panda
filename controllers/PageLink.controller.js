var Config = require('../config/config');
var mongoose = require('mongoose');
const PageLink = mongoose.model('PageLink');

exports.allPageLinks = async (req, res) =>  {
    console.log("Page Links");
    let pageLinks = await PageLink.findOne();
    return res.json({success: true, banner: pageLinks.banner, terms: pageLinks.terms, privacy: pageLinks.privacy, contact: pageLinks.contact });
};

exports.updatePageLink = async (req, res) =>  {

    let pageIndex = req.body.pageIndex;
    let content = req.body.content;
    let pagelink = await PageLink.findOne();

    switch(pageIndex) {
        case 0:
            pagelink.banner.image = content.image;
            pagelink.banner.url = content.url;
            await pagelink.save();
            break;

        case 1:
            pagelink.terms = content;
            await pagelink.save();
            break;
        
        case 2:
            pagelink.privacy = content;
            await pagelink.save();
            break;

        case 3:
            pagelink.contact = content;
            await pagelink.save();
            break;

        default:
            pagelink.banner = content;
            await pagelink.save();
            break;
    }

    let pageLinks = await PageLink.findOne();
    return res.json({success: true, banner: pageLinks.banner, terms: pageLinks.terms, privacy: pageLinks.privacy, contact: pageLinks.contact });

};
