import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "dspace",
};
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    try {
      const connection = await mysql.createConnection(dbConfig);

      // Preparar la consulta para insertar los registros
      const insertQuery = `
        INSERT INTO orcid (dni, nombreapellido, orcid)
        VALUES (?, ?, ?)
      `;

      // Insertar cada fila de datos
      for (const row of data) {
        const [dni, nombreapellido, orcid] = row;
        if (dni && nombreapellido && orcid) {
          await connection.query(insertQuery, [dni, nombreapellido, orcid]);
        }
      }

      connection.end();
      res.status(200).json({ message: "Datos cargados exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al procesar el archivo" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
