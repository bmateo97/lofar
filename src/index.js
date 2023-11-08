const express = require("express");
const database = require("./Utils/database.js");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

app.post("/ingresar", (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    database(
      "CALL ingresar(?, ?);",
      (result) => {
        if (result) return res.json(result);
        return res.json({
          message: "Usuario no encontrado",
        });
      },
      [usuario, contrasena]
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al iniciando sesion",
      error,
    });
  }
});

app.get("/registrarse", (req, res) => {
  res.send("Hello World!");
});

app.get("/images", (req, res) => {
  try {
    database("CALL obtenerImagenes();", (result) => {
      if (result) return res.json(result);
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las imagenes",
    });
  }
});

app.post("/insertar", (req, res) => {
  try {
    const { categoria, blob } = req.body;
    console.log(categoria, blob);
    database(
      "CALL insertarImage(?,?);",
      (result) => {
        console.log("Result: ->", result);
        if (result)
          res.json({
            message: "Imagen guardada",
          });
      },
      [categoria, blob]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error insertando imagen",
      error,
    });
  }
});

app.delete("/eliminar", (req, res) => {
  try {
    const { id } = req.body;
    database(
      "CALL eliminar-imagen(?);",
      (result) => {
        if (result)
          res.json({
            message: "Imagen eliminada",
          });
      },
      [id]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando imagen",
    });
  }
});

app.get("*", (req, res) => {
  res.send("Not Found !");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
