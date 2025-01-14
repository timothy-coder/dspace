// pages/api/investigaciones/upload.js
import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { data } = req.body;
      console.log("Datos recibidos:", data);

      // Inserta los datos en la base de datos
      for (const item of data) {
        const query = `
          INSERT INTO investigaciones (codigo, titulo, autor, dni_autor)
          VALUES (?, ?, ?, ?)
        `;
        const values = [item.codigo, item.titulo, item.autor, item.dni_autor];
        await db.execute(query, values);
      }

      // Responde con un mensaje exitoso
      res.status(200).json({ message: "Datos cargados correctamente" });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: "Error al cargar los datos" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
