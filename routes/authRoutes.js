const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const { register } = require("../controllers/authController");
//const { default: Login } = require("../../src/pages/Login");
const {login} = require ('../controllers/login');

const router = express.Router();


router.post("/register", register);
router.post('/login', login);


module.exports = router;