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

app.post("/registrarse", (req, res) => {
  try {
    const { nombres, apellidos, email, telefono, contrasena } = req.body;
    database("CALL registro(?, ?, ?, ?, ?);", (result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(500).json({
          message: "Email ya registrado !",
        });
      }

    }, [nombres, apellidos, email, telefono, contrasena]);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.messege,
      error,
    }); 
  }
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

app.get("/getpanel", (req, res) => {
  try {
    database("CALL getPanel();", (result) => {
      if (result) return res.json(result);
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el panel",
    });
  }
});

app.post("/insertar", (req, res) => {
  try {
    const { categoria, blob, existencias, descripcion, precio, genero } = req.body;
    database(
      "CALL insertarImage(?,?,?,?,?,?);",
      (result) => {
        if (result)
          res.json({
            message: "Imagen guardada",
          });
      },
      [categoria, blob, existencias, descripcion, precio, genero]
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
      "CALL eliminarImagen(?);",
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

app.post("/actualizar", (req, res) => {
  try {
    const { id, existencias } = req.body;
    database(
      "CALL actualizarExistencias(?, ?);",
      (result) => {
        if (result)
          res.json({
            message: "Existencias Actualizadas",
          });
      },
      [id, existencias]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando existencias",
    });
  }
});

app.post("/descripcion", (req, res) => {
  try {
    const { id, descripcion, precio } = req.body;
    database(
      "CALL actualizarDescripcion(?, ?, ?);",
      (result) => {
        if (result)
          res.json({
            message: "Descripcion Actualizada",
          });
      },
      [id, descripcion, precio]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando descripcion",
    });
  }
});

app.post("/panel", (req, res) => {
  try {
    const { url, title } = req.body;
    database(
      "CALL panel(?, ?);",
      (result) => {
        if (result)
          res.json({
            message: "Descripcion Actualizada",
          });
      },
      [url, title]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando panel",
    });
  }
});

app.post("/comprar", (req, res) => {
  try {
    const { id, cantidad } = req.body;
    database(
      "CALL comprar(?, ?);",
      (result) => {
        if (result)
          res.json({
            message: "Compra realizada",
          });
      },
      [id, cantidad]
    );
  } catch (error) {
    res.status(500).json({
      message: "Error realizando compra",
    });
  }
});

app.get("*", (req, res) => {
  res.send("Not Found !");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
