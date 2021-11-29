const express = require("express");
const authController = require("../controllers/authController.js");

const authRoute = express.Router();

authRoute.post("/signup",authController.signUp);
authRoute.get("/verify/:accessToken",authController.verifyAccount);
authRoute.post("/signin",authController.signIn)



module.exports = authRoute