var mongoose = require('mongoose');
passport = require('passport');
const Activity = mongoose.model('Activity');

exports.allActivities = async (req, res) =>  {
    Activity.find()
        .exec(function(err, activities) {
        if (err) {
            return res.json({success: false, errMessage: "Unknown errors occurred while getting all activities."});
        } else {
            return res.json({success: true, activities: activities});
        }
    });

};

exports.addActivity = async (req, res) =>  {

    // let activitiy = new Activity(req.body);
    // activitiy.save(async (err) => {
    //     if (err) {
    //         return res.json({success: false, errMessage: "Unknown errors occurred while registering."});
    //     } else {
    //         let activities = await Activity.find();
    //         return res.json({success: true, activities: activities});
    //     }
    // }); 
};

