var mongoose = require('mongoose');
passport = require('passport');
const ShortCut = mongoose.model('ShortCut');

exports.allShortCuts = async (req, res) =>  {
    ShortCut.find()
        .exec(function(err, shortcuts) {
        if (err) {
            return res.json({success: false, errMessage: "Unknown errors occurred while getting all shortcuts."});
        } else {
            return res.json({success: true, shortcuts: shortcuts});
        }
    });

};

exports.addShortCut = async (req, res) => {
    let shortcutObj = new ShortCut(req.body);
    await shortcutObj.save();
    let shortcuts = await ShortCut.find();
    return res.json({success: true, shortcuts: shortcuts});
}

exports.updateShortCut = async (req, res) =>  {
    let shortcutObj = new ShortCut(req.body);

    ShortCut.findOneAndUpdate({_id: shortcutObj._id}, {
        key: shortcutObj.key,
        value: shortcutObj.value,
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, shortcut){
        if(err) {
            return res.json({success: false, errMessage: "Unknown errors occurred while updating clarizen shortcuts."});
        } else {
            let shortcuts = await ShortCut.find();
            return res.json({success: true, shortcuts: shortcuts});
        }
    });
};

exports.deleteShortCut = (req,res) => {
    var id = req.params.id;
    ShortCut.findByIdAndRemove(id, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while deleting shortcut."});
        } else {

            let shortcuts = await ShortCut.find();
            return res.json({success: true, shortcuts: shortcuts});
        }
    });

};