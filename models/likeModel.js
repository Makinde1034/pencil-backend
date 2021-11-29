const mongoose = require("mongoose");

const Schema = mongoose.Schema

const likeSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts"
    }
})

module.exports = mongoose.model("like",likeSchema);