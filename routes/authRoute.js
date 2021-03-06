const express = require("express");
const authController = require("../controllers/authController.js");
const cors = require("cors");
const {verify_access} = require("../middlewares/verify_access.js");
const { body,validationResult,check } = require('express-validator');

const authRoute = express.Router();

authRoute.post(
    "/signup",
    check('password')
        .isLength({ min: 5 })
        .withMessage('password must be at least 5 chars long'),
        
    authController.signUp,
    
);

authRoute.post("/signin",cors(),authController.signIn);
authRoute.get("/verify/:accessToken",authController.verifyAccount);
authRoute.get("/user",authController.findUser);
authRoute.post("/update-profile",verify_access,authController.updateUserProfile);
authRoute.post("/follow",verify_access,authController.followUser);
authRoute.post("/unfollow",verify_access,authController.unfollowUser);
authRoute.get("/get-followers",verify_access,authController.getFollowers);
authRoute.post("/check-follow",verify_access,authController.isUserFollowing);
authRoute.get("/getUserProfile",verify_access,authController.getUserProfile);




module.exports = authRoute