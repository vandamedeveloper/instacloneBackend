const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postsRoutes");
const imageRoutes = require("./controllers/ImageRoutes");
// const imageRoutes = require("./controllers/ImageRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Inicio del servidor
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => console.log(`Error de conexión a la base de datos: ${err}`));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/images", imageRoutes);
