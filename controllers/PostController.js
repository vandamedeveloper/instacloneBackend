const Post = require("../models/Post");
const File = require("../models/File");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();
// Configuración de Multer para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createPost = async (req, res, next) => {
  try {
    // create image and store it
    const { caption } = req.body;
    const userId = req.user;
    const { file } = req;

    const created_file = new File({
      filename: file.originalname,
      contentType: file.mimetype,
      length: file.size,
      uploadDate: new Date(),
      imageUrl: `http://localhost:3000/api/images/${file.id}`,
      metadata: {
        user: userId.id,
        post: null,
      },
    });
    const savedFile = await created_file.save();
    // Crear el modelo de post y guardar el ID del archivo
    const post = new Post({
      user: userId.id,
      caption,
      image: created_file,
    });
    const savedPost = await post.save();

    res.status(200).json({
      success: true,
      post: {
        _id: savedPost._id,
        user: savedPost.user,
        image: savedFile.imageId,
        caption: savedPost.caption,
        createdAt: savedPost.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    // get user id

    const { id } = req.user;

    // get all posts from db
    const posts = await Post.find({})
      .populate("image")
      .populate("user")
      .sort({ createdAt: "desc" });

    console.log(posts);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating post" });

    next(error);
  }
};

exports.getPostByName = async (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No se encontró el archivo" });
    }
    // Verifica si la imagen es una imagen
    console.log("image id: ", filename);
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Crea un flujo de lectura y envía la imagen como una respuesta HTTP
      const readstream = gfs.createReadStream(file.filename);
      console.log("readstream: ", readstream);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "No es una imagen" });
      next(error);
    }
  });
  res.json({ message: "hello world" });
};
