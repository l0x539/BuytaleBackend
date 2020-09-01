const { db } = require("../database/db");

getUser = (req, res, next) => {
    db.select("*").from('profiles')
        .where("user_uuid", "=", req.session.userUUID)
        .then(user => res.json(user))
        .catch(err => res.json(err.stack))
}

EditProfile = (req, res, next) => {
    const { emails, firstname, lastname } = req.body
    db.select('*').from('profiles')
        .where('user_uuid', '=', req.session.userUUID)
        .then(user => {
            db('profiles')
                .where("user_uuid", "=", req.session.userUUID)
                .update({
                    more_emails: emails && !req.emails?emails.split(",").map(item => item.trim()).join():user[0].more_emails,
                    firstname: firstname && !req.firstname?firstname:user[0].firstname,
                    lastname: lastname && !req.lastname?lastname:user[0].lastname,
                    last_updated: new Date()
                })
                .then(data => res.json({
                    success: data, 
                    emails: emails && req.emails?"Emails in wrong format":undefined, 
                    firstname: firstname && req.firstname?"Firstname can be Alphanumeric only":undefined,
                    lastname: lastname && req.lastname?"Firstname can be Alphanumeric only":undefined
                }))
        })
}

module.exports = {
    getUser,
    EditProfile
}