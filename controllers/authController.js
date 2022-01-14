const User = require("../models/authModel.js");
const Follow = require("../models/followModel.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
const multer = require("multer");
const { json } = require("express");
const { validationResult } = require("express-validator");
const hbs = require('nodemailer-express-handlebars')
const path = require("path");
require("dotenv").config();




const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user : process.env.email,
        pass : process.env.password
    }
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))



exports.signUp = async (req,res) => {                                                  
    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors:"Password must be 5 letters long.",success:false });
            // throw new Error({ errors:"Password must be 5 letters long." ,success : false });
        }
        const {username, email, password} = req.body
   

        // check if username exists in database
        const emailExists = await User.findOne({email})

        if(emailExists){
            res.status(409).json("User with this username exists") 
        }

        const usernameExists = await User.findOne({username})

        if(usernameExists){
            res.status(409).json("User with the email already exist")
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            username,
            email,
            password : hashedPassword
        })



        const accessToken = jwt.sign(
            { user_id: newUser._id },
            process.env.ACCESS_TOKEN,
            {expiresIn : "2m"}
        )

        const url = `http://localhost:4000/verify/${accessToken}`

        transporter.sendMail({
            from : process.env.email,
            to : email,
            subject :"Verify Email",
            template: 'confirmEmail',
            context : {
                email : email,
                url :url
            }
            // html: `<p>Click <a href=${url}>here</a> to confirm your email</p>`
             
        })

        // res.status(200).json({
        //     newUser,
        //     accessToken
        // })
        res.status(200).json({
            message : `verification email sent to ${email}`
        })
        



    }catch(err){
        console.log(err);
        res.json(err)
    }
   

    
}

exports.signIn = async (req,res) =>{
    
    try{
        const { email,password } = req.body

        const user = await User.findOne({email});

        // const userVerified = user.verified

        // if(!userVerified){
        //     res.status(404).json("Account has to be verified")
        // }
        
        if(user && ( await bcrypt.compare(password,user.password)) ){
            const token = jwt.sign({user_id : user._id},process.env.ACCESS_TOKEN,{expiresIn : "24h"})

            return res.status(200).json({
                token,
                user
            })
        }
        res.status(400).json({msg:"Email or password is incorrect"});
    }catch(err){
        console.log(err)
    }
    
    

     
}


exports.verifyAccount = async (req,res) =>{
    const { accessToken } = req.params

    if(!accessToken){
        res.status(401).json({message:"No token found"})
    }

    let payload = null

    try{
        payload = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN
        )
    }catch(err){
        res.status(401).json("Token verification failed")
    }

    const user = await User.findOne({_id:payload.user_id})

    if(!user){
        return res.status(404).json("User not found")
    }

    user.verified = true

    await user.save()

    res.status(200).json("Account verified")


}


exports.findUser = (req,res) =>{
    User.find().then((result)=>{
        res.json(result)
    })
}

// image upload 

const Storage = multer.diskStorage({
    destination : "uploads",
    filename : (req,file,cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + "-" + uniqueSuffix)
    }
})

const upload = multer({
    storage : Storage,

}).single("image")

exports.updateUserProfile= async(req,res)=>{
    // console.log(req.body)
    User.findByIdAndUpdate(
        {_id:req.user_id},
        {
            $set : {
                bio : req.body.bio,
                username : req.body.username,
                image : req.body.image

            }
        }
    ).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.json(err);
    })
}

// follow user
exports.followUser = async(req,res) =>{
    Follow.create({userId : req.body.userId, senderId : req.user_id}).then((result)=>{
        return User.findByIdAndUpdate(
            {_id : req.user_id},
            {
                $push : {
                    following : req.body.userId
                }
            }
        ).then(()=>{
            return User.findByIdAndUpdate(
                {_id : req.body.userId},
                {
                    $push : {
                        followers : req.user_id
                    }
                }
            ).then(()=>{
                res.json(result);
            })
        })
        
    }).catch((err)=>[
        res.json(err.message)

    ])
}


// get followers
exports.getFollowers= async(req,res)=>{
    try{
        const followers = await Follow.aggregate([
            {
                $match : {
                    userId : mongoose.Types.ObjectId(req.user_id)
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField : 'senderId',
                    foreignField : '_id',
                    as : 'user'

                }
            },
            {$unwind: { path: '$user', preserveNullAndEmptyArrays: true }}
            
        ])
        res.json(followers);
        
    }catch(err){
        res.json(err);console.log(err.message);              
    }
    
}

exports.isUserFollowing = async(req,res)=>{
    const isFollowing = await Follow.exists({userId:req.body.userId, senderId : req.user_id});  
    
    if(isFollowing){
        res.json(true);
    }else{
        res.json(false)
    }
}

exports.unfollowUser = (req,res) =>{
    Follow.deleteOne({userId : req.body.userId, senderId : req.user_id}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.json(err)
    })
}

exports.getUserProfile = (req,res) => {
    User.findById({_id : req.user_id}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.json(err)
    })
}