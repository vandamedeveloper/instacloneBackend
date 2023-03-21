const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();
const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});

const store = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb("filetype");
}

const uploadMiddleware = (req, res, next) => {
  const upload = store.single("image");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: "File too large" });
    } else if (err) {
      if (err === "filetype")
        return res
          .status(400)
          .json({ success: false, error: "Type not accepted" });
    }
    next();
  });
};

// router.post("/upload", uploadMiddleware, async (req, res) => {
//   const { file } = req;
//   const { id } = file;
//   if (file.size > 5000000) {
//     deleteImage(id);
//     return res
//       .status(400)
//       .json({ success: false, error: " File shoud not exceed 5MB" });
//   }
//   console.log("uplaoded file: ", file);
//   return res.status(200).send(file.id);
// });

const deleteImage = (id) => {
  if (!id || id === "undefined")
    return res
      .status(400)
      .json({ success: false, error: "No image id provided" });
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
  });
};

router.get("/:id", async ({ params: { id } }, res) => {
  if (!id || id === "undefined")
    return res
      .status(400)
      .json({ success: false, error: "No image id provided" });

  try {
    const _id = new mongoose.Types.ObjectId(id);
    await gfs.find({ _id }).toArray();
    gfs.openDownloadStream(_id).pipe(res);
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error });
  }
});
module.exports = router;
