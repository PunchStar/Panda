exports.fileUpload = async (req, res) =>  {
    console.log("fileupload")
    const files = Object.entries(req.files);
    let data = [];
    for(let i = 0 ; i < files.length ; i ++) {
        let file = files[i][1];
        if(process.env.NODE_ENV !== 'production')
            file.mv('./client/public/recording/'+ files[i][0] + '.ogg');
        else
            file.mv('./client/build/recording/'+ files[i][0] + '.ogg');
        data.push({            
            name:file.name,
            mimetype: data.mimetype,
            size:file.size
        })
    }

    return res.json({success: true, successFiles: data});
};
 
exports.fileTextUpload = async (req, res) =>  {
    console.log("filetextupload")
    const files = Object.entries(req.files);
    let data = [];
    for(let i = 0 ; i < files.length ; i ++) {
        let file = files[i][1];
        if(process.env.NODE_ENV !== 'production')
            file.mv('./client/public/text/'+ files[i][0] + '.txt');
        else
            file.mv('./client/build/text/'+ files[i][0] + '.txt');
        data.push({            
            name:file.name,
            mimetype: data.mimetype,
            size:file.size
        })
    }

    return res.json({success: true, successFiles: data});
};