const express = require('express');

const { loginApi, registerApi } = require("../API/Sign");
const { getUser, EditProfile } = require("../API/coreAPI");
const { loggedInCheck, registerInputCheck, notLoggedInCheck, editProfileCheck } = require("../utils/functions")

const router = express.Router();


/* GET requests */
// Get user infos.
router.get('/user', notLoggedInCheck, getUser)

/* POST requets */
// Login user:
router.post('/login', loggedInCheck, loginApi);

// Register User:
router.post('/register', loggedInCheck, registerInputCheck, registerApi);

/* PUT requests */
// Update User Prodile:
router.put('/editprofile', notLoggedInCheck, editProfileCheck, EditProfile)

module.exports = router;