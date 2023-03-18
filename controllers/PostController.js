const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  try {
    // Get post data
    const { caption } = req.body;
    const { id } = req.user;
    const { buffer } = req.file;

    // Create an instance of Post
    const post = new Post({
      user: id,
      caption,
    });

    // Save post
    const savedPost = await post.save();

    res.status(200).json({
      success: true,
      post: {
        _id: savedPost._id,
        user: savedPost.user,
        caption: savedPost.caption,
        createdAt: savedPost.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error creating post" });
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    // get user id

    const { id } = req.user;

    // get all posts from db

    const posts = await Post.find({})
      .populate("user")
      .sort({ createdAt: "desc" });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating post" });

    next(error);
  }
};
