
const bcrypt = require('bcrypt');
const { db } = require("../database/db");

loginApi = (req, res, next) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('logins')
        .where('email', '=', email)
        .then(data => {
        if (bcrypt.compareSync(password, data[0].hash)) {
            return db.select('*').from('profiles')
            .where('email', '=', email)
            .returning('*')
            .then(user => {
                db('profiles')
                .where('email', '=', data[0].email)
                .update({
                    last_login: new Date()
                })
                .increment('login_attemp')
                .then(d => {
                    req.session.loggedIn = true;
                    req.session.userUUID = user[0].user_uuid;
                    return res.json(user[0])
                })
            })
            .catch(err => res.status(400).json({error: "Unable to login"}));
        } else 
            res.status(400).json({ error: {password: "Wrong Password!" }})
        })
        .catch(err => res.status(400).json(err.stack))
}

registerApi = (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;
    db.transaction(trx => {
      trx.insert({ email, hash: bcrypt.hashSync(password, 10) }).into('logins')
        .returning('email')
        .then(loginEmail => {
          return trx.insert({ email: loginEmail[0], firstname, lastname, registered: new Date(), last_login: new Date(), verified: false }).into('profiles')
            .returning('*')
            .then(data => {
              req.session.loggedIn = true;
              req.session.userUUID = data[0].user_uuid;
              res.json(data)
            })
            .catch(err => {
              res.status(400).json({error:"Something went wrong"})
            })
      })
        .then(trx.commit)
        .catch(trx.rollback)
    })
      .catch(err => {
        if (err.message.includes('duplicate key'))
          res.status(400).json({ email: "Email Already exist" })
        else 
          res.status(400).json("Could not Register.")
      })
  }

module.exports = {
    loginApi,
    registerApi
}