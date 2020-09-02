const express = require('express');

const { loginApi, registerApi, prepareUpdatePassword, updatePassword, forgotPasswd } = require("../API/Sign");
const { getUser, EditProfile } = require("../API/coreAPI");
const { loggedInCheck, checkLoginInput, registerInputCheck, notLoggedInCheck, editProfileCheck, emailCheck, passwdCheck } = require("../utils/functions")

const router = express.Router();


/* GET requests */
// Get user infos.
router.get('/user', notLoggedInCheck, getUser)

/* POST requets */
// Login user:
router.post('/login', loggedInCheck, checkLoginInput, loginApi);

// Register User:
router.post('/register', loggedInCheck, registerInputCheck, registerApi);

// Update Password:
router.post('/update-password', prepareUpdatePassword, notLoggedInCheck, passwdCheck, updatePassword)

// Forgot Password:
router.post('/forgot-password', loggedInCheck, emailCheck, forgotPasswd)

/* PUT requests */
// Update User Prodile:
router.put('/editprofile', notLoggedInCheck, editProfileCheck, EditProfile)

module.exports = router;