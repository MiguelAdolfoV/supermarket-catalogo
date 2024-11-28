const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "supermarket",
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// Endpoint para obtener categorías
app.get("/categories", (req, res) => {
  const query = "SELECT * FROM categoria";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get("/proveedores", (req, res) => {
  const query = "SELECT * FROM persona WHERE tipo_persona = 'Proveedor'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/proveedores", (req, res) => {
  const { nombre, tipo_documento, num_documento, direccion, telefono, email } = req.body;

  const query = `
    INSERT INTO persona (tipo_persona, nombre, tipo_documento, num_documento, direccion, telefono, email)
    VALUES ('Proveedor', ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [nombre, tipo_documento, num_documento, direccion, telefono, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, message: "Proveedor registrado con éxito" });
  });
});

app.post('/addarticulos', (req, res) => {
  const { nombre, idcategoria, codigo, precio_venta, stock, descripcion } = req.body;

  const query = `
    INSERT INTO articulo (idcategoria, codigo, nombre, precio_venta, stock, descripcion, estado)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(query, [idcategoria, codigo, nombre, precio_venta, stock, descripcion], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, message: 'Producto agregado correctamente' });
  });
});


// Endpoint para obtener productos de una categoría
app.get("/products/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const query = "SELECT * FROM articulo WHERE idcategoria = ?";
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});


app.get("/articulos", (req, res) => {
  db.query("SELECT * FROM articulo WHERE estado = 1", (err, results) => {
    if (err) res.status(500).send(err);
    else res.json(results);
  });
});

app.post("/ingresos", (req, res) => {
  const {
    idproveedor,
    idusuario,
    tipo_comprobante,
    serie_comprobante,
    num_comprobante,
    fecha,
    impuesto,
    total,
    detalles, // Lista de productos con idarticulo, cantidad, precio_unitario
  } = req.body;

  // Validaciones iniciales
  if (!idproveedor || !idusuario || !tipo_comprobante || !num_comprobante || !fecha || !detalles || detalles.length === 0) {
    console.error("Error: Datos incompletos en la solicitud");
    return res.status(400).json({ message: "Faltan datos requeridos para registrar el ingreso." });
  }

  console.log("Datos recibidos para ingreso:", {
    idproveedor,
    idusuario,
    tipo_comprobante,
    serie_comprobante,
    num_comprobante,
    fecha,
    impuesto,
    total,
    detalles,
  });

  const ingresoQuery = `
    INSERT INTO ingreso (idproveedor, idusuario, tipo_comprobante, serie_comprobante, num_comprobante, fecha, impuesto, total, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Activo')
  `;

  db.query(
    ingresoQuery,
    [idproveedor, idusuario, tipo_comprobante, serie_comprobante, num_comprobante, fecha, impuesto, total],
    (err, result) => {
      if (err) {
        console.error("Error al insertar en ingreso:", err);
        return res.status(500).send(err);
      }

      const ingresoId = result.insertId; // Obtener el ID del ingreso recién creado
      console.log("Ingreso registrado con ID:", ingresoId);

      const detalleQuery = `
        INSERT INTO detalle_ingreso (idingreso, idarticulo, cantidad, precio)
        VALUES ?
      `;

      // Preparar los valores para insertar en detalle_ingreso
      const detalleValues = detalles.map((detalle) => {
        const precioTotal = parseFloat(detalle.precio_unitario) * parseInt(detalle.cantidad);
        console.log(`Procesando detalle: Artículo ${detalle.idarticulo}, Cantidad ${detalle.cantidad}, Precio total ${precioTotal}`);
        return [
          ingresoId,
          detalle.idarticulo,
          detalle.cantidad,
          precioTotal, // Calcular el precio total
        ];
      });

      db.query(detalleQuery, [detalleValues], (err) => {
        if (err) {
          console.error("Error al insertar en detalle_ingreso:", err);
          return res.status(500).send(err);
        }

        console.log("Detalles registrados exitosamente:", detalleValues);

        // Actualizar el stock de los artículos
        const updateStockPromises = detalles.map((detalle) => {
          const updateStockQuery = `
            UPDATE articulo
            SET stock = stock + ?
            WHERE idarticulo = ?
          `;
          return new Promise((resolve, reject) => {
            db.query(updateStockQuery, [detalle.cantidad, detalle.idarticulo], (err) => {
              if (err) {
                console.error(`Error al actualizar el stock del artículo ${detalle.idarticulo}:`, err);
                return reject(err);
              }
              console.log(`Stock actualizado para artículo ${detalle.idarticulo}: +${detalle.cantidad}`);
              resolve();
            });
          });
        });

        // Ejecutar todas las actualizaciones de stock
        Promise.all(updateStockPromises)
          .then(() => {
            res.json({ message: "Ingreso registrado y stock actualizado correctamente" });
          })
          .catch((err) => {
            console.error("Error al actualizar el stock:", err);
            res.status(500).send(err);
          });
      });
    }
  );
});


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
