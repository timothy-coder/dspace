import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678root",
  database: "dspace",
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { data } = req.body; // Datos enviados desde el frontend

      console.log("Datos recibidos en el backend:", data);

      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "No se recibieron datos válidos" });
      }

      // Conectar a la base de datos
      const connection = await mysql.createConnection(dbConfig);

      // Preparar las consultas para la inserción masiva
      const queries = data.map(({ facultad, grado, nombreapellidodecano, denominacion, modelooficio,estado}) => {
        return connection.query(
          "INSERT INTO decanos (facultad, grado, nombreapellidodecano, denominacion, modelooficio,estado) VALUES (?,?,?,?,?,?) ",[facultad, grado, nombreapellidodecano,denominacion, modelooficio,estado]
        );
      });

      await Promise.all(queries); // Ejecutar todas las consultas en paralelo
      await connection.end(); // Cerrar la conexión

      res.status(200).json({ message: "Datos procesados exitosamente" });
    } catch (error) {
      console.error("Error en el backend:", error.message);
      res.status(500).json({ error: "Error al procesar los datos" });
    }
  } else {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
