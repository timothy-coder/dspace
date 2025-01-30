import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678root",
  database: "dspace",
};

export default async function handler(req, res) {
  const { method } = req;

  const connection = await mysql.createConnection(dbConfig);

  try {
    switch (method) {
      case "GET": // Obtener todos los registros
        const [rows] = await connection.query("SELECT * FROM decanos");
        res.status(200).json(rows);
        break;

      case "POST": // Agregar un registro
        const { facultad, grado, nombreapellidodecano,denominacion,modelooficio,estado } = req.body;

        // Validación de los datos enviados
        if (!facultad || !nombreapellidodecano || !denominacion || !modelooficio || !estado || !grado) {
          res.status(400).json({ error: "Todos los campos son requeridos" });
          return;
        }

        await connection.query(
          "INSERT INTO decanos (facultad, grado, nombreapellidodecano,denominacion,modelooficio,estado) VALUES (?,?,?,?, ?, ?)",
          [facultad, grado, nombreapellidodecano,denominacion,modelooficio,estado]
        );
        res.status(201).json({ message: "Registro agregado exitosamente" });
        break;

      case "PUT": // Editar un registro
        const { facultad: facultadToUpdate, grado: newGrado, nombreapellidodecano: newNombreapellidodecano,denominacion:newDenominacion,modelooficio:newModelooficio,estado:newEstado  } = req.body;

        if (!facultadToUpdate || !newGrado || !newNombreapellidodecano || !newDenominacion || !newModelooficio || !newEstado) {
          res.status(400).json({ error: "Todos los campos son requeridos" });
          return;
        }

        await connection.query(
          "UPDATE decanos SET grado = ?, nombreapellidodecano = ?,denominacion=?,modelooficio=?,estado=? WHERE facultad = ?",
          [newGrado, newNombreapellidodecano,newDenominacion,newModelooficio,newEstado, facultadToUpdate]
        );
        res.status(200).json({ message: "Registro actualizado exitosamente" });
        break;

      case "DELETE": // Eliminar un registro
        const { facultad: facultadToDelete } = req.body;

        if (!facultadToDelete) {
          res.status(400).json({ error: "El campo facultad es requerido para eliminar el registro" });
          return;
        }

        await connection.query("DELETE FROM decanos WHERE facultad = ?", [facultadToDelete]);
        res.status(200).json({ message: "Registro eliminado exitosamente" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.end();
  }
}
