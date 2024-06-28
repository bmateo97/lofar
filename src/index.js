const express = require("express");
const database = require("./Utils/database.js");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { Console } = require("console");

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
    const { categoria, blob, existencias, descripcion, precio, genero, codigo } = req.body;
    database(
      "CALL insertarImage(?,?,?,?,?,?,?);",
      (result) => {
        if (result)
          res.json({
            message: "Imagen guardada",
          });
      },
      [categoria, blob, existencias, descripcion, precio, genero, codigo]
    );
    res.status(200).json({codigo});
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

const nodemailer = require('nodemailer');

app.post("/email/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const { nombre, total, productos } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secure: false,
      port: 587,
      auth: {
        user: "joyas_lofar@hotmail.com",
        pass: "joyaslofar", // Ten en cuenta que exponer contraseñas en el código no es una práctica segura
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    const mailOptions = {
      from: '"Lofar Joyeria" <joyas_lofar@hotmail.com>',
      to: address,
      subject: "Compra realizada exitosamente",
      html: `
        <h1>Gracias por su compra, ${nombre}</h1>
        <p>Esperamos que disfrute sus productos.</p>
        <p>Total de su compra: $${total}</p>
        <h2>Detalle de productos:</h2>
        <ul>
          ${productos.map(producto => `<li>${producto.codigo} - Cantidad: ${producto.cantidad}</li>`).join("")}
        </ul>
      `,
    };

    const mailOptions2 = {
      from: '"Lofar Joyeria" <joyas_lofar@hotmail.com>',
      to: "joyas_lofar@hotmail.com",
      subject: "Pedido pendiente de envío",
      html: `
        <h1>Nuevo pedido recibido</h1>
        <p>El usuario con el correo ${address} ha realizado una compra. Por favor, enviar el pedido lo antes posible.</p>
        <p>Total de productos: ${productos.length}</p>
        <p>Total de la compra: $${total}</p>
        <h2>Detalle de productos:</h2>
        <table>
          <tr><th>Producto</th><th>Cantidad</th></tr>
          ${productos.map((producto) => `<tr><td>${producto.codigo}</td><td>${producto.cantidad}</td></tr>`).join("")}
        </table>
      `,
    };

    const [response1, response2] = await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(mailOptions2)
    ]);

    console.log('Emails enviados:', response1.messageId, response2.messageId);
    res.status(200).json({ message: "Emails enviados exitosamente" });
  } catch (error) {
    console.error('Error al enviar los emails:', error);
    res.status(500).json({
      message: "Error enviando email",
      error: error.message,
    });
  }
});
app.get("/historial", async (req, res) => {
  try {
    database("CALL historial();", (result) => {
      if (result) return res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el historial",
    });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    database("CALL usuarios();", (result) => {
      if (result) return res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
