const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  imageUrl: String,
  filename: String,
  contentType: String,
  length: Number,
  uploadDate: Date,
  metadata: Object,
});

const File = mongoose.model("File", FileSchema, "uploads.files");
module.exports = File;
