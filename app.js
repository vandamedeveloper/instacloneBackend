const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postsRoutes");
const cors = require("cors");

dotenv.config();

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión a la base de datos establecida"))
  .catch((err) => console.log(`Error de conexión a la base de datos: ${err}`));

// Configuración de express
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
