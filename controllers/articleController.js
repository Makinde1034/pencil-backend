const User = require("../models/authModel.js");
const Post = require("../models/articleModel.js");
const Likes = require("../models/likeModel.js");
const mongoose = require("mongoose");


// post an article
exports.postArticle = (req,res) => {
    User.findOne({_id:req.user_id}).then(hh=>{
        Post.create({userId: req.user_id, creatorImage: hh.image, creator: hh.email, ...req.body}).then((result)=>{
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


    const alreadyLiked = await Likes.exists({userId: req.user_id, postId: req.params.id});

    if(alreadyLiked){
        await Likes.deleteOne({userId: req.user_id, postId: req.params.id})
        await Post.updateOne({ _id: req.params.id }, { $inc: { likes: -1 } }) 
         res.status(200).json("post unliked")
       
    }else{
        await Likes.create({
            userId: req.user_id,
            postId: req.params.id
        })
        await Post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } })

        res.status(200).json("post liked")
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


exports.getLikedPosts = async (req, res)=>{ 
    try{
        const userId = req.params.id
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
    Post.find().sort({_id : -1}).then((result)=>{
        res.json(result)
    })
}

exports.getUserPosts = (req,res) =>{
    User.findById(req.params.id).populate("posts").then((result)=>{
        res.json(result)
    })
}

// add a comment
exports.addComment = (req,res) =>{

    User.findOne({_id:req.user_id}).then((user)=>{
        return Post.findByIdAndUpdate(
            {_id:req.body.postId},
            {
                $push:{
                    comments : { comment: req.body.comment, creator : user.email}
                }
            }
        ).then((result)=>{
            res.json(result);
        }).catch(err=>{
            res.json(err.msg);
        })
    })
    
}

exports.deletePost = (req,res) =>{
    Post.findByIdAndDelete({_id : req.body.postId}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.json("An error occured.")
    })
}