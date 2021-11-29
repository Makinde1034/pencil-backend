const User = require("../models/authModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user : process.env.email,
        pass : process.env.password
    }
})


exports.signUp = async (req,res) => {                                                  
    try{
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
            html: `<p>Click <a href=${url}>here</a> to confirm your email</p>`
             
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
    }
   

    
}

exports.signIn = async (req,res) =>{
    
    try{
        const { email,password } = req.body

        const user = await User.findOne({email});

        const userVerified = user.verified

        // if(!userVerified){
        //     res.status(404).json("Account has to be verified")
        // }
        
        if(user && bcrypt.compare(password,user.password)){
            const token = jwt.sign(
                {user_id : user._id},
                process.env.ACCESS_TOKEN,
                {
                    expiresIn : "24h"
                }
            )

            res.status(200).json({
                token,
                user
            })
        }
        res.status(404).json("email or password incorrect");
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