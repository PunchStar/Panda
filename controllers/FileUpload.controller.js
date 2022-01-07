const AWS = require('aws-sdk');

AWS.config.update({
    "accessKeyId": "AKIA5EANCY2PAMEW57LK", 
    "secretAccessKey": "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",
    "region": "us-east-1"
});
    
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
  
exports.fileUpload = async (req, res) =>  {
    const files = Object.entries(req.files);
    let uploadParams = {};
    let successFiles = 0, failureFiles = 0;
    for(let i = 0 ; i < files.length ; i ++) {
        let file = files[i][1];
        uploadParams = {
            Bucket: 'personal-filestorage', 
            Key: file.name, 
            Body: file.data,
            ContentType: file.mimetype,
            ACL:'public-read-write'
        };
        await s3.upload(uploadParams, function(err, data) {
            if(err) {
                console.log(err);
                failureFiles ++;
            } else {
                successFiles ++;
            }
        })
    }

    return res.json({success: true, successFiles: successFiles, failureFiles: failureFiles});
};

exports.updateAdminAvatar = async (req, res) => {
    if(req.files !== null) {
        if(req.files.file !== undefined) {
            let file = req.files.file;

            let uploadParams = {
                Bucket: 'personal-filestorage/avatar', 
                Key: file.name, 
                Body: file.data,
                ContentType: file.mimetype,
                ACL:'public-read-write'
            };
            await s3.upload(uploadParams, function(err, data) {
                if(err) {
                    console.log(err);
                    return res.json({success: false, errMessage: err});
                } else {
                    return res.json({success: true});
                }
            })
        }
    }
}

exports.updateBannerImage = async (req, res) => {
    if(req.files !== null) {
        if(req.files.file !== undefined) {
            let file = req.files.file;

            let uploadParams = {
                Bucket: 'personal-filestorage/banner', 
                Key: file.name, 
                Body: file.data,
                ContentType: file.mimetype,
                ACL:'public-read-write'
            };
            await s3.upload(uploadParams, function(err, data) {
                if(err) {
                    console.log(err);
                    return res.json({success: false, errMessage: err});
                } else {
                    return res.json({success: true});
                }
            })
        }
    }
}


exports.updateBannerImage = async (req, res) => {
    if(req.files !== null) {
        if(req.files.file !== undefined) {
            let file = req.files.file;

            let uploadParams = {
                Bucket: 'personal-filestorage/banner', 
                Key: file.name, 
                Body: file.data,
                ContentType: file.mimetype,
                ACL:'public-read-write'
            };
            await s3.upload(uploadParams, function(err, data) {
                if(err) {
                    console.log(err);
                    return res.json({success: false, errMessage: err});
                } else {
                    return res.json({success: true});
                }
            })
        }
    }
}
