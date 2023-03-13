const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: { type: String, required: true },
  profilePicture: {
    type: String,
    default: "https://rare-gallery.com/uploads/posts/363893-4k-wallpaper.jpg",
  },
  biography: { type: String },
  website: { type: String },
  gender: { type: String },
  phone: { type: String },
  birthday: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
