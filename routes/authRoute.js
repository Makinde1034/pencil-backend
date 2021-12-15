const express = require("express");
const authController = require("../controllers/authController.js");
const cors = require("cors");
const {verify_access} = require("../middlewares/verify_access.js")

const authRoute = express.Router();

authRoute.post("/signup",authController.signUp);
authRoute.post("/signin",cors(),authController.signIn);
authRoute.get("/verify/:accessToken",authController.verifyAccount);
authRoute.get("/user",authController.findUser);
authRoute.post ("/update-profile/",verify_access,authController.updateUserProfile)




module.exports = authRoute