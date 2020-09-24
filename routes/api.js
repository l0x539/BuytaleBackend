const express = require('express');

const { loggedin, loginApi, registerApi, logoutApi, prepareUpdatePassword, updatePassword, forgotPasswd } = require("../API/Sign");
const { getUser, EditProfile, EditProfilePicture } = require("../API/coreAPI");
const { loggedInCheck, checkLoginInput, registerInputCheck, notLoggedInCheck, editProfileCheck, emailCheck, passwdCheck, upload } = require("../utils/functions")

const router = express.Router();


/* GET requests */
// Get user infos.
router.get('/@me', notLoggedInCheck, getUser)

// Check if user logged in
router.get("/loggedin", loggedin)

// Logout user:
router.get('/logout', notLoggedInCheck, logoutApi);

/* POST requets */
// Login user:
router.post('/login', loggedInCheck, checkLoginInput, loginApi);

// Register User:
router.post('/register', loggedInCheck, registerInputCheck, registerApi);

// Update Password:
router.put('/update-password', prepareUpdatePassword, notLoggedInCheck, passwdCheck, updatePassword)

// Forgot Password:
router.post('/forgot-password', loggedInCheck, emailCheck, forgotPasswd)

/* PUT requests */
// Update User Profile:
router.put('/editprofile', notLoggedInCheck, editProfileCheck, EditProfile)
// Update User Profile Picture:
router.post('/editprofile/picture', notLoggedInCheck, upload.single("avatar"), EditProfilePicture)

module.exports = router;