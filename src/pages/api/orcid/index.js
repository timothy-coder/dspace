import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "dspace",
};

export default async function handler(req, res) {
  const { method } = req;

  const connection = await mysql.createConnection(dbConfig);

  try {
    switch (method) {
      case "GET": // Obtener todos los registros
        const [rows] = await connection.query("SELECT * FROM orcid");
        res.status(200).json(rows);
        break;

      case "POST": // Agregar un registro
        const { dni, nombreapellido, orcid } = req.body;
        await connection.query(
          "INSERT INTO orcid (dni, nombreapellido, orcid) VALUES (?, ?, ?)",
          [dni, nombreapellido, orcid]
        );
        res.status(201).json({ message: "Registro agregado" });
        break;

      case "PUT": // Editar un registro
        const { dni: dniToUpdate, nombreapellido: newNombre, orcid: newOrcid } = req.body;
        await connection.query(
          "UPDATE orcid SET nombreapellido = ?, orcid = ? WHERE dni = ?",
          [newNombre, newOrcid, dniToUpdate]
        );
        res.status(200).json({ message: "Registro actualizado" });
        break;

      case "DELETE": // Eliminar un registro
        const { dni: dniToDelete } = req.body;
        await connection.query("DELETE FROM orcid WHERE dni = ?", [dniToDelete]);
        res.status(200).json({ message: "Registro eliminado" });
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
const fetchData = async () => {
  const response = await fetch("/api/orcid");
  const result = await response.json();
  console.log(result); // Revisa el resultado aquí
  setData(result);
};
