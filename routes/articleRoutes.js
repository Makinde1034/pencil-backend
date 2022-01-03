const express = require("express");
const articleController = require("../controllers/articleController.js");
const { verify_access } = require("../middlewares/verify_access.js");

const articleRoute = express.Router();

articleRoute.post("/post",verify_access,articleController.postArticle);
articleRoute.post("/like/:id",verify_access,articleController.likeUnlikeArticle);
articleRoute.get("/get-user-likes/:id",articleController.getLikedPosts);
articleRoute.get("/get-all-posts",articleController.getAllPosts);
articleRoute.get("/user-posts/:id",articleController.getUserPosts);
articleRoute.post("/add-comment",verify_access,articleController.addComment);
articleRoute.delete("/delete-post",verify_access,articleController.deletePost);

module.exports = articleRoute