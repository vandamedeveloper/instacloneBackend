// routes/userRoutes.js
const express = require("express");
const {
  createUser,
  loginUser,
  getUserInfo,
} = require("../controllers/UserController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);

router.get("/me", verifyToken, getUserInfo);

module.exports = router;
