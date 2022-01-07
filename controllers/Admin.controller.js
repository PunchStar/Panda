var mongoose = require('mongoose');
passport = require('passport');
const Admin = mongoose.model('Admin');
const User = mongoose.model('User');
const Activity = mongoose.model('Activity');
const fileUpload = require("./FileUpload.controller");

exports.register = async (req, res) =>  {
    await Admin.findOne({ email: req.body.email }).then(admin => {
        if(admin) {
            return res.json({success: false, errMessage: "Email already exists"});
        } else {
            let admin = new Admin(req.body);
            admin.setPassword(req.body.password);
            admin.save((err) => {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while new admin registering."});
                } else {
                    res.status(200).json({success:true});
                }
            }); 
        }
    })
};

exports.login = async (req, res) =>  {  
    await Admin.findOne({email: req.body.email }).then(admin => {
        if(!admin) {
           
            User.findOne({email: req.body.email }).then(user => {
                if(!user) {
                    return res.json({success: false, errMessage: "Email not found. Please confirm your email again!"});
                } else {
                    let result = user.validatePassword(req.body.password);
                    if(!result) {
                        return res.json({success: false, errMessage: "Password is wrong. Please confirm your password again!"});
                    } else {
                        let token = user.generateJwt();
                        res.json({success: true, role: 1, token: token, user: user});
                    }
                }
            })
        } else {
            let result = admin.validatePassword(req.body.password);
            if(!result) {
                return res.json({success: false, errMessage: "Password is wrong. Please confirm your password again!"});
            } else {
                let token = admin.generateJwt();
                res.json({success: true, role: 0, token: token, user: admin});
            }
        }
    })

};

exports.updateAdmin = async (req, res) =>  {  

    var jsonAdmin = JSON.parse(req.body.jsonAdmin);
    let adminObj = new Admin(jsonAdmin);
    adminObj.setPassword(jsonAdmin.password);
console.log(adminObj)
    Admin.findOneAndUpdate({}, {
        email: adminObj.email,
        password: adminObj.password,
        avatar: adminObj.avatar,
        incomeRedger: adminObj.incomeRedger,
        expensiveRedger: adminObj.expensiveRedger
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, admin){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating admin."});
        } else {
            //Generate new activity
            let activityObj = { type: 3, key: "You" };
            let newActivity = new Activity(activityObj);
            newActivity.generateNewActivity();
            await newActivity.save();

            let activities = await Activity.find();
            return res.json({success: true, admin: admin, activities: activities});
        }
    });
};
