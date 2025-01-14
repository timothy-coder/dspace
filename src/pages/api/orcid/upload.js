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
    const { data } = req.body;

    // Validar los datos recibidos
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Datos inválidos o vacíos" });
    }

    try {
      // Procesar los datos (ejemplo: guardarlos en una base de datos)
      console.log("Datos recibidos:", data);

      // Simulación de guardado exitoso
      res.status(200).json({ message: "Datos cargados exitosamente" });
    } catch (error) {
      console.error("Error procesando los datos:", error);
      res.status(500).json({ error: "Error al guardar los datos" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
