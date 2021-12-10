const express = require("express");
const authController = require("../controllers/authController.js");
const cors = require("cors")

const authRoute = express.Router();

authRoute.post("/signup",authController.signUp);
authRoute.get("/verify/:accessToken",authController.verifyAccount);
authRoute.post("/signin",cors(),authController.signIn);
authRoute.get("/user",authController.findUser);




module.exports = authRoute