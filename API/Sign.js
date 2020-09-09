const { db } = require("../database/db");
const { randomBytes } = require('crypto');
const { checkPasswd, hashPasswd, loginPasswd } = require('../utils/functions')

const loginApi = (req, res, next) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('logins')
        .where('email', '=', email)
        .then(data => {
        if (data && data.length > 0) {
          if (loginPasswd(password, data[0].hash)) {
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
                      req.session.email = user[0].email;
                      return res.json(user[0])
                  })
              })
              .catch(err => res.status(400).json({error: "Unable to login"}));
          } else 
              res.status(400).json({ error: {password: "Wrong Password!" }})
          } else {res.status(400).json({error: "Unable to login"})}
        })
        .catch(err => res.status(400).json(err.stack))
}

const registerApi = (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;
    db.transaction(trx => {
      trx.insert({ email, hash: hashPasswd(password) }).into('logins')
        .returning('email')
        .then(loginEmail => {
          return trx.insert({ email: loginEmail[0], firstname, lastname, registered: new Date(), last_login: new Date(), verified: false }).into('profiles')
            .returning('*')
            .then(data => {
              req.session.loggedIn = true;
              req.session.userUUID = data[0].user_uuid;
              req.session.email = data[0].email;
              res.json(data)
            })
            .catch(err => {
              console.log(err.stack)
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

const logoutApi = (req, res, next) => {
  req.session.destroy();
  res.json("Logged out.")
}

const forgotPasswd = (req, res, next) => {
  randomBytes(32, function(ex, buf) {
      if (req.session.forgotpwtime) {
        if ((new Date()) - (new Date(req.session.forgotpwtime)) < 10*1000) {
          return res.status(400).json("Cooldown.")
        }
      }
      token = buf.toString('hex');
      if (token) {
          db.insert({ 
            email: req.body.email, 
            token, created_at: new Date(), 
            ip_addr:  req.headers['x-forwarded-for'] || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress ||
                      (req.connection.socket ? req.connection.socket.remoteAddress : null)
           }).into('forgotten_passwords')
              .then(s => {
                req.session.forgotpwtime = new Date();
                res.json({success: true})
              })
              .catch(err => res.status(400).json("Something went wrong"))
      }
  });
}

const updatePassword = (req, res, next) => {
  const { password } = req.body
  const hash = hashPasswd(password)
  console.log(2);
  db('logins')
    .where('email', '=', req.session.email)
    .update({ hash })
    .then(s => res.json(req.user))
    .catch(err => res.status(400).json("Something went wrong."))
  
}
const prepareUpdatePassword = (req, res, next) => {
  const { token } = req.body
  if (token) {
    db.select('email').from('forgotten_passwords')
      .where('token', '=', token)
      .then(data => {
        db.select('*').from('profiles')
          .where('email', '=', data[0].email)
          .then(user => {
            req.session.loggedIn = true;
            req.session.userUUID = user[0].user_uuid;
            req.session.email = user[0].email;
            req.user = user[0]
            next()
          })
          .catch(err => res.status(400).json(err.stack)) //({"message": "Not Found"}))
      }).catch(err => res.status(400).json({"message": "Not Found"}))
  } else {
    next()
  }
}


module.exports = {
    loginApi,
    registerApi,
    logoutApi,
    forgotPasswd,
    prepareUpdatePassword,
    updatePassword
}