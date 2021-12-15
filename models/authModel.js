const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String
    },
    image :{
        data:Buffer,
        contentType:String
    },
    bio : {
        type : String
    },
    
    email : {
        type : String
    },

    password : {
        type : String
    },

    accessToken :{
        type : String
    },

    verified : {
        type : Boolean,
        default : false,
        required : true
    },
    
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "article"
        }
    ],

    followers : {
        type : Number,
        default : 0
    },

    favourited : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref :"article"
        }
    ]
})

module.exports = mongoose.model("user",userSchema);