const mongoose = require('mongoose');

const Schema = mongoose.Schema

const followerSchema = new Schema({
     userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    viewed : {
        type : String,
        default : false
    }
});

module.exports = mongoose.model('follower',followerSchema);
