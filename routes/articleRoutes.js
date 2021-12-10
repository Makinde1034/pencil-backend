const express = require("express");
const articleController = require("../controllers/articleController.js");
const { verify_access } = require("../middlewares/verify_access.js");

const articleRoute = express.Router();

articleRoute.post("/post",verify_access,articleController.postArticle);
articleRoute.post("/like",verify_access,articleController.likeUnlikeArticle);
articleRoute.post("/get-post-by-likes",verify_access,articleController.getLikedPosts);
articleRoute.get("/get-all-posts",articleController.getAllPosts);
articleRoute.get("/user-posts/:id",articleController.getUserPosts)

module.exports = articleRoute