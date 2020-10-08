const { db } = require("../database/db");
const path = require("path");
const fs = require("fs");
const mmm = require('mmmagic');
const { v4: uuidv4 } = require('uuid');

Magic = mmm.Magic;

const getUser = (req, res, next) => {
    db.select("*").from('profiles')
        .where("user_uuid", "=", req.session.userUUID)
        .then(user => res.json(user))
        .catch(err => res.json(err.stack))
}

const EditProfile = (req, res, next) => {
    const { emails, firstname, lastname } = req.body
    db.select('*').from('profiles')
        .where('user_uuid', '=', req.session.userUUID)
        .then(user => {
            db('profiles')
                .where("user_uuid", "=", req.session.userUUID)
                .update({
                    more_emails: emails && !req.emails?emails.split(",").map(item => item.trim()).join():undefined,
                    firstname: firstname && !req.firstname?firstname:undefined,
                    lastname: lastname && !req.lastname?lastname:undefined,
                    last_update: new Date()
                })
                .then(data => res.json({
                    success: data, 
                    emails: emails && req.emails?"Emails in wrong format":undefined, 
                    firstname: firstname && req.firstname?"Firstname can be Alphanumeric only":undefined,
                    lastname: lastname && req.lastname?"Firstname can be Alphanumeric only":undefined
                }))
        })
}

const handleError = (err, res) => {
    console.log(err)
    res.status(500)
       .json("Oops! Something went wrong!");
};

const EditProfilePicture = (req, res, next) => {
    const tempPath = req.file.path;
    const magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);
    magic.detectFile(tempPath, function(err, result) {
        if (err) throw err;
        if (new RegExp(["png", "jpeg", "jpg", "gif"].join("|")).test(result) 
            && (path.extname(req.file.originalname).toLowerCase() === ".png"
                || path.extname(req.file.originalname).toLowerCase() === ".jpg"
                || path.extname(req.file.originalname).toLowerCase() === ".jpeg"
                || path.extname(req.file.originalname).toLowerCase() === ".gif"
                )) {
            const newfilename = uuidv4() + path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.join(__dirname, "../public/uploads/profilepictures/" + newfilename); 
            db('profiles')
                .where("user_uuid", "=", req.session.userUUID)
                .update({
                    avatar: newfilename
                })
                .then(data => {
                    fs.rename(tempPath, targetPath, err => {
                        if (err) return handleError(err, res);
                
                        res.status(200)
                           .json(["File uploaded!", {newfilename}]);
                    });
                })
            
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);
        
                res
                .status(403)
                .json("Only png/jpg/gif files are allowed!");
            });
        }
    });
}

module.exports = {
    getUser,
    EditProfile,
    EditProfilePicture
}