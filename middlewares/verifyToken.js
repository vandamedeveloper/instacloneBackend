const jwt = require("jsonwebtoken");

// Middleware de verificación de token
const verifyToken = (req, res, next) => {
  // Obtener el token de la cabecera de autorización
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Si no hay token, devolver un error de autenticación
  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de autenticación" });
  }

  try {
    // Verificar el token y obtener los datos del usuario
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }
        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Token de autenticación inválido", err, token });
  }
};

module.exports = verifyToken;
