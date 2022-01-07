const mongoose = require("mongoose");

const Schema = mongoose.Schema

const articleSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    creator : {
        type : String
 
    },
    creatorImage :{
        type : Binary
    },
    title : {
        type : String
    },
    body : {
        type : String
    },
    likes: {
        type: Number,
        default: 0
    },
    comments : []
},{ timestamps: true })

module.exports = mongoose.model("article",articleSchema);