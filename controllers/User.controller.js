var mongoose = require('mongoose');
passport = require('passport');
const User = mongoose.model('User');
const Activity = mongoose.model('Activity');

exports.register = async (req, res) =>  {
    await User.findOne({ email: req.body.email }).then(user => {
        if(user) {
            return res.json({success: false, errMessage: "Email already exists"});
        } else {
            let user = new User(req.body);
            user.setPassword(req.body.password);
            user.save(async (err) => {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while registering."});
                } else {
                    let token = user.generateJwt();
                    res.json({success: true, role: 1, token: token, user: user});
                }
            }); 
        }
    })
};

exports.allUsers = async (req, res) =>  {
    User.find()
        .exec(function(err, users) {
        if (err) {
            return res.json({success: false, errMessage: "Unknown errors occurred while getting all users."});
        } else {
            return res.json({success: true, users: users});
        }
    });

};

exports.addUser = async (req, res) =>  {
    await User.findOne({ email: req.body.email }).then(user => {
        if(user) {
            return res.json({success: false, errMessage: "Email already exists"});
        } else {
            let user = new User(req.body);
            user.setPassword(req.body.password);
            user.save(async (err) => {
                if (err) {
                    return res.json({success: false, errMessage: "Unknown errors occurred while registering."});
                } else {

                    //Generate new activity
                    let activityObj = { type: 0, key: user.fullName };
                    let newActivity = new Activity(activityObj);
                    newActivity.generateNewActivity();
                    await newActivity.save();
                    
                    let users = await User.find();
                    let activities = await Activity.find();
                    return res.json({success: true, users: users, activities: activities});
                }
            }); 
        }
    })
};

exports.updateUser = async (req, res) =>  {

    let userObj = new User(req.body);
    userObj.setPassword(req.body.password);

    User.findByIdAndUpdate(userObj._id, {
        fullName: userObj.fullName,
        address: userObj.address,
        phoneNumber: userObj.phoneNumber,
        email: userObj.email,
        password: userObj.password,
        companyName: userObj.companyName,
        fico: userObj.fico,
        bankName: userObj.bankName,
        accountNumber: userObj.accountNumber,
        routingNumber: userObj.routingNumber,
        zelle: userObj.zelle,
        driverLicense: {
            file: userObj.driverLicense.file,
            state: userObj.driverLicense.state
        },
        social: {
            file: userObj.social.file,
            state: userObj.social.state
        },
        passport: {
            file: userObj.passport.file,
            state: userObj.passport.state
        },
        tax: {
            files: userObj.tax.files,
            state: userObj.tax.state,
        },
        statement: {
            files: userObj.statement.files,
            state: userObj.statement.state,
        },
        utility: {
            file: userObj.utility.file,
            state: userObj.utility.state
        },
        phoneBill: {
            file: userObj.phoneBill.file,
            state: userObj.phoneBill.state
        },
        additionalDoc: {
            files: userObj.additionalDoc.files,
            state: userObj.additionalDoc.state,
        },
        amountMonth: userObj.amountMonth,
        managementFee: userObj.managementFee,
        referer: userObj.referer,
        notes: userObj.notes,
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating user."});
        } else {

            //Generate new activity
            let activityObj = { type: 1, key: user.fullName };
            let newActivity = new Activity(activityObj);
            newActivity.generateNewActivity();
            await newActivity.save();

            let users = await User.find();
            let activities = await Activity.find();
            return res.json({success: true, users: users, activities: activities});
        }
    });
};

exports.updateRealUser = async (req, res) => {
    
    let userObj = new User(req.body);
    userObj.setPassword(req.body.password);
    User.findByIdAndUpdate(userObj._id, {
        fullName: userObj.fullName,
        address: userObj.address,
        phoneNumber: userObj.phoneNumber,
        email: userObj.email,
        password: userObj.password,
        companyName: userObj.companyName,
        fico: userObj.fico,
        bankName: userObj.bankName,
        accountNumber: userObj.accountNumber,
        routingNumber: userObj.routingNumber,
        zelle: userObj.zelle,
        driverLicense: {
            file: userObj.driverLicense.file,
            state: userObj.driverLicense.state
        },
        social: {
            file: userObj.social.file,
            state: userObj.social.state
        },
        passport: {
            file: userObj.passport.file,
            state: userObj.passport.state
        },
        tax: {
            files: userObj.tax.files,
            state: userObj.tax.state,
        },
        statement: {
            files: userObj.statement.files,
            state: userObj.statement.state,
        },
        utility: {
            file: userObj.utility.file,
            state: userObj.utility.state
        },
        phoneBill: {
            file: userObj.phoneBill.file,
            state: userObj.phoneBill.state
        },
        additionalDoc: {
            files: userObj.additionalDoc.files,
            state: userObj.additionalDoc.state,
        },
        amountMonth: userObj.amountMonth,
        managementFee: userObj.managementFee,
        referer: userObj.referer,
        notes: userObj.notes,
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating user."});
        } else {
            return res.json({success: true, user: user});
        }
    });
}

exports.updateUserOneItem = (req, res) => {
    let userObj = req.body;
    User.findByIdAndUpdate(userObj._id, {
        [userObj.key]: userObj.value
    }, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while updating user."});
        } else {

            //Generate new activity
            let activityObj = { type: 1, key: user.fullName };
            let newActivity = new Activity(activityObj);
            newActivity.generateNewActivity();
            await newActivity.save();

            let users = await User.find();
            let activities = await Activity.find();
            return res.json({success: true, users: users, activities: activities});
        }
    });
}

exports.deleteUser = (req,res) => {
    var id = req.params.id;
    User.findByIdAndRemove(id, {
        new: true,
        useFindAndModify: false
    }, async function(err, user){
        if(err) {
            res.json({success: false, errMessage: "Unknown errors occurred while deleting user."});
        } else {

            //Generate new activity
            let activityObj = { type: 2, key: user.fullName };
            let newActivity = new Activity(activityObj);
            newActivity.generateNewActivity();
            await newActivity.save();

            let users = await User.find();
            let activities = await Activity.find();
            return res.json({success: true, users: users, activities: activities});
        }
    });

};