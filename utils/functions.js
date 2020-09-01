
checkEmail = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

checkName = (firstname) => firstname.match(/^[0-9a-zA-Z]+$/)

checkPasswd = (password) => /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/.test(password)

const loggedInCheck = (req, res, next) => {
    if (req.session.loggedIn) {
      return res.status(404).json({"message": "Not Found"})
    } else {
        next();
    }    
  };

const notLoggedInCheck = (req, res, next) => {
    if (!req.session.loggedIn) {
      return res.status(404).json({"message": "Not Found"})
    } else {
        next();
    }    
  };
  
const registerInputCheck = (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;
    let errors = {};
    if (!checkEmail(email)) 
      errors.email = "Wrong format email";
    if (!checkName(firstname))
      errors.firstname = "First Name should be AlphaNumeric";
    if (!checkName(lastname))
      errors.lastname = "Last Name should be AlphaNumeric";
    if (!checkPasswd(password)) 
      errors.password = "Password should be atleast 8 characters and Alphanumeric (use special characters for a stronger password)";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors)
    } else {
      next();
    }
  }

  const editProfileCheck = (req, res, next) => {
    const { emails, firstname, lastname } = req.body
    if (emails && emails.split(",").length > 0)
        emails.split(",").forEach(email => {
            if (!checkEmail(email.trim())) req.emails = true; 
        })
    if (!checkName(firstname)) req.firstname = true
    if (!checkName(lastname)) req.lastname = true
    next()
  }

  module.exports = {
    loggedInCheck,
    registerInputCheck,
    notLoggedInCheck,
    editProfileCheck
  }