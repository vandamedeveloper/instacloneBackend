// controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    await user.save();

    // generate access_token
    const access_token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      access_token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrectos" });
    }

    // generate access_token
    const access_token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ access_token });
  } catch (error) {
    res.status(500).json({ success: false, error });

    next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    // Obtener el usuario actual desde el token de autenticación
    const { id } = req.user;
    // Buscar el perfil del usuario en la base de datos
    const profile = await User.findOne({ _id: id });
    // Devolver toda la información del usuario
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error });
    next(error);
  }
};
