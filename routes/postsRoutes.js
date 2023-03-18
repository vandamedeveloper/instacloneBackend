const express = require("express");
const { createPost, getPosts } = require("../controllers/PostController");
const uploadMiddleware = require("../middlewares/multerMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * CREATE POST
 */
router.post(
  "/upload",
  verifyToken,
  uploadMiddleware.single("image"),
  createPost
);

/**
 * GET ALL POSTS
 */

router.get("/posts", verifyToken, getPosts);

module.exports = router;
