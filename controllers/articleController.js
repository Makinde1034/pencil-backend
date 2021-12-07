const User = require("../models/authModel.js");
const Post = require("../models/articleModel.js");
const Likes = require("../models/likeModel.js");
const mongoose = require("mongoose");


// post an article
exports.postArticle = (req,res) => {
    User.findOne({_id:req.user_id}).then(hh=>{
        // res.json(hh)
        console.log(hh.email,  ' hh here')
        Post.create({userId: req.user_id, creator: hh.email, ...req.body}).then((result)=>{
            return User.findByIdAndUpdate(
                {_id : req.user_id},
                {
                    $push : {
                        posts : result._id
                    }
                }
            ).then((post)=>{ 
                res.status(200).json(result)                              
            }).catch((err)=>{
                res.status(404).json("An error occured while trying to create post");
            })
        }).catch((err)=>{
            res.json("Error occured while trying to create post");
        })
    }).catch((err)=>{
        console.log(err.message)
        res.json("An error occured while")
    })    
} 

// like a post
exports.likeUnlikeArticle = async(req,res) => {

    const {user_id} = req
    const post_id = req.body.postId

    const alreadyLiked = await Likes.exists({userId: user_id, postId: post_id});

    if(alreadyLiked){
        await Likes.deleteOne({userId: user_id, postId: post_id})
        await Post.updateOne({ _id: post_id }, { $inc: { likes: -1 } }) 
       
    }else{
        await Likes.create({
            userId: user_id,
            postId: post_id
        })
        await Post.updateOne({ _id: post_id }, { $inc: { likes: 1 } })
    }





    // Post.findByIdAndUpdate(
    //     {_id : req.body._id},
    //     {
    //         $push : {
    //             favourites : req.user_id
    //         }
    //     }
    // ).then(()=>{
    //     User.findByIdAndUpdate(
    //        {_id : req.user_id},
    //        {
    //            $push : {
    //                favourited : req.body._id
    //            }
    //        }
    //    ).then((result)=>{
    //         res.json(result.favourited)                      
    //    }).catch(err=>{
    //        res.json(err)
    //    })
    // }).catch((err)=>{
    //     res.json(err)
    // })
}


exports.getPostsByLikes = async (req, res)=>{
    try{
        const userId = req.body.userId
        const _posts = await Likes.aggregate([
            {$match: {
                userId: mongoose.Types.ObjectId(userId)
            }},
            {$lookup:{
                from: 'articles',
                localField: 'postId',
                foreignField: '_id',
                as: 'articles'
            }},
            {$unwind: { path: '$articles', preserveNullAndEmptyArrays: true }}
        ])

        res.json(_posts)

    }catch(err){
        console.log(err)
    }
}

exports.getAllPosts = (req,res) =>{
    Post.find().then((result)=>{
        res.json(result)
    })
}

exports.getUserPosts = (req,res) =>{
    User.findById(req.params.id).populate("posts").then((result)=>{
        res.json(result)
    })
}