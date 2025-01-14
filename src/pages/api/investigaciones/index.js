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

  // Crear una conexión a la base de datos
  const connection = await mysql.createConnection(dbConfig);

  try {
    switch (method) {
      case "GET": // Obtener todos los registros
        const [rows] = await connection.query("SELECT * FROM investigaciones");
        res.status(200).json(rows);
        break;

      case "POST": // Agregar un registro
        const { 
          codigo, 
          titulo, 
          autor, 
          dni_autor, 
          asesor, 
          dni_asesor, 
          orcid, 
          fecha, 
          titulo_grado, 
          denominacion, 
          facultad, 
          ocde, 
          tipo, 
          codigo_programa, 
          porcentaje_similitud_oti, 
          porcentaje_similitud_asesor, 
          jurado_1, 
          jurado_2, 
          jurado_3, 
          autoridad_firmante, 
          numero_oficio_referencia, 
          autorizacion, 
          denominacion_si_no, 
          titulo_si_no, 
          tipo_tesis_si_no, 
          porcentaje_reporte_tesis_si_no, 
          observaciones, 
          url, 
          numero_oficio, 
          estado 
        } = req.body;

        await connection.query(
          `INSERT INTO investigaciones (
            codigo, titulo, autor, dni_autor, asesor, dni_asesor, orcid, fecha, titulo_grado, 
            denominacion, facultad, ocde, tipo, codigo_programa, porcentaje_similitud_oti, 
            porcentaje_similitud_asesor, jurado_1, jurado_2, jurado_3, autoridad_firmante, 
            numero_oficio_referencia, autorizacion, denominacion_si_no, titulo_si_no, 
            tipo_tesis_si_no, porcentaje_reporte_tesis_si_no, observaciones, url, 
            numero_oficio, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            codigo, titulo, autor, dni_autor, asesor, dni_asesor, orcid, fecha, titulo_grado, 
            denominacion, facultad, ocde, tipo, codigo_programa, porcentaje_similitud_oti, 
            porcentaje_similitud_asesor, jurado_1, jurado_2, jurado_3, autoridad_firmante, 
            numero_oficio_referencia, autorizacion, denominacion_si_no, titulo_si_no, 
            tipo_tesis_si_no, porcentaje_reporte_tesis_si_no, observaciones, url, 
            numero_oficio, estado
          ]
        );
        res.status(201).json({ message: "Registro agregado exitosamente" });
        break;

      case "PUT": // Actualizar un registro
        const { id, ...updateData } = req.body;

        const updateFields = Object.keys(updateData)
          .map((key) => `${key} = ?`)
          .join(", ");
        const updateValues = Object.values(updateData);

        await connection.query(
          `UPDATE investigaciones SET ${updateFields} WHERE id = ?`,
          [...updateValues, id]
        );
        res.status(200).json({ message: "Registro actualizado exitosamente" });
        break;

      case "DELETE": // Eliminar un registro
        const { id: idToDelete } = req.body;
        await connection.query("DELETE FROM investigaciones WHERE id = ?", [idToDelete]);
        res.status(200).json({ message: "Registro eliminado exitosamente" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error en la API:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Cerrar la conexión a la base de datos
    connection.end();
  }
}
