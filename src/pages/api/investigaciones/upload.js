import formidable from 'formidable';
import fs from 'fs';
import mysql from 'mysql2/promise';
import XLSX from 'xlsx';

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678root",
  database: "dspace",
};

// Manejo de la carga de archivos
export const config = {
  api: {
    bodyParser: false, // Desactivar el bodyParser de Next.js para usar formidable
  },
};

const uploadFile = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./tmp"; // El directorio donde se guardarán los archivos temporalmente
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al procesar el archivo:", err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    if (!files.file) {
      console.error("No se subió ningún archivo.");
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    const filePath = files.file[0].filepath;

    // Leer y procesar el archivo Excel
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
      
      console.log("Datos procesados del archivo:", jsonData);

      if (jsonData.length === 0) {
        return res.status(400).json({ error: "El archivo Excel no contiene datos válidos" });
      }

      // Aquí puedes hacer la inserción en la base de datos
      const connection = await mysql.createConnection(dbConfig);

      // Prepara la consulta de inserción, ajusta según tu estructura de datos
      const insertQuery = `
        INSERT INTO investigaciones (titulo, autor, dni_autor, autor2, dni_autor2, asesor, dni_asesor, orcid, fecha, tipo, facultad, tipo_trabajo, palabrasclave)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const row of jsonData) {
        const values = [
          row[0],  // titulo
          row[1],  // autor
          row[2],  // dni_autor
          row[3],  // autor2
          row[4],  // dni_autor2
          row[5],  // asesor
          row[6],  // dni_asesor
          row[7],  // orcid
          row[8],  // fecha
          row[9],  // tipo
          row[10], // facultad
          row[11], // tipo_trabajo
          row[12], // palabrasclave
        ];

        await connection.execute(insertQuery, values);
      }

      connection.end();
      return res.status(200).json({ message: "Datos cargados exitosamente" });
    } catch (error) {
      console.error("Error al procesar el archivo Excel:", error);
      return res.status(500).json({ error: "Error al procesar el archivo Excel" });
    }
  });
};

export default uploadFile;
