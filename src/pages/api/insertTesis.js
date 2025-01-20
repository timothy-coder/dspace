// pages/api/insertTesis.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        titulo,
        autor1,
        dniAutor1,
        autor2,
        dniAutor2,
        asesor,
        dniAsesor,
        orcid,
        facultad,
        grado,
        tipoTrabajo,
        jurado1,
        jurado2,
        jurado3,
        gradoAcademico,
        palabrasClave,
      } = req.body;

      // Generar el código basado en el grado académico
      let gradoCodigo = "";
      if (gradoAcademico.toLowerCase().startsWith("especialista")) {
        gradoCodigo = "S";
      } else if (
        gradoAcademico.toLowerCase().startsWith("maestro") ||
        gradoAcademico.toLowerCase().startsWith("maestra")
      ) {
        gradoCodigo = "M";
      } else if (
        gradoAcademico.toLowerCase().startsWith("doctor") ||
        gradoAcademico.toLowerCase().startsWith("doctora")
      ) {
        gradoCodigo = "D";
      } else {
        gradoCodigo = "T"; // Si no es especialista, maestro, maestra, doctor o doctora, asignamos 'T'
      }

      // Generar los códigos para los autores
      const codigo1 = `T010_${dniAutor1}_${gradoCodigo}`; // Primer autor
      const codigo2 = autor2 && dniAutor2 ? `T010_${dniAutor2}_${gradoCodigo}` : null; // Segundo autor (si existe)

      // Consultar valores de ocde y codigo_programa basados en la facultad
      const ocdeQuery = `
        SELECT ocde, codigoprograma 
        FROM ocde 
        WHERE facultad = ?;
      `;

      const [result] = await pool.query(ocdeQuery, [facultad]);

      if (result.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron valores de OCDE para la facultad proporcionada." });
      }

      const { ocde, codigoprograma } = result[0];

      // Crear consulta SQL para insertar datos
      const insertQuery = `
        INSERT INTO dspace.investigaciones 
        (codigo, titulo, autor, dni_autor, autor2, dni_autor2, asesor, dni_asesor, orcid, facultad, titulo_grado, tipo, jurado_1, jurado_2, jurado_3, Denominacion, PalabrasClave, ocde, codigo_programa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Insertar los datos en un solo registro
      const values = [
        codigo1 + (codigo2 ? `, ${codigo2}` : ""), // Unir ambos códigos de los autores en un solo campo
        titulo, // Título de la tesis
        autor1,
        dniAutor1,
        autor2,
        dniAutor2, // DNIs concatenados
        asesor, // Asesor
        dniAsesor, // DNI del asesor
        orcid, // ORCID
        facultad, // Facultad
        grado, // Grado
        tipoTrabajo, // Tipo de trabajo
        jurado1, // Jurado 1
        jurado2, // Jurado 2
        jurado3, // Jurado 3
        gradoAcademico, // Grado académico
        palabrasClave, // Palabras clave
        ocde, // Valor de OCDE obtenido
        codigoprograma, // Valor de código programa obtenido
      ];

      // Ejecutar la consulta de inserción
      await pool.query(insertQuery, values);

      // Respuesta exitosa
      res.status(200).json({ message: "Datos insertados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al insertar los datos" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
/*// pages/api/insertTesis.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        titulo,
        autor1,
        dniAutor1,
        autor2,
        dniAutor2,
        asesor,
        dniAsesor,
        facultad,
        grado,
        tipoTrabajo,
        jurado1,
        jurado2,
        jurado3,
        gradoAcademico,
        palabrasClave,
      } = req.body;

      // Generar el código basado en el grado académico
      let gradoCodigo = "";
      if (gradoAcademico.toLowerCase().startsWith("especialista")) {
        gradoCodigo = "S";
      } else if (
        gradoAcademico.toLowerCase().startsWith("maestro") ||
        gradoAcademico.toLowerCase().startsWith("maestra")
      ) {
        gradoCodigo = "M";
      } else if (
        gradoAcademico.toLowerCase().startsWith("doctor") ||
        gradoAcademico.toLowerCase().startsWith("doctora")
      ) {
        gradoCodigo = "D";
      } else {
        gradoCodigo = "T"; // Si no es especialista, maestro, maestra, doctor o doctora, asignamos 'T'
      }

      // Generar los códigos para los autores
      const codigo1 = `T010_${dniAutor1}_${gradoCodigo}`; // Primer autor
      const codigo2 = autor2 && dniAutor2 ? `T010_${dniAutor2}_${gradoCodigo}` : null; // Segundo autor (si existe)

      // Consultar valores de ocde y codigo_programa basados en la facultad
      const ocdeQuery = `
        SELECT ocde, codigoprograma 
        FROM ocde 
        WHERE facultad = ?;
      `;

      const [ocdeResult] = await pool.query(ocdeQuery, [facultad]);

      if (ocdeResult.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron valores de OCDE para la facultad proporcionada." });
      }

      const { ocde, codigoprograma } = ocdeResult[0];

      // Consultar valores de nombre y orcid del asesor basados en dniAsesor
      const asesorQuery = `
        SELECT nombreapellido, orcid 
        FROM orcid 
        WHERE dni = ?;
      `;

      const [asesorResult] = await pool.query(asesorQuery, [dniAsesor]);

      if (asesorResult.length === 0) {
        return res
          .status(400)
          .json({ message: "No se encontraron datos del asesor para el DNI proporcionado." });
      }

      const { nombreapellido: asesorNombre, orcid } = asesorResult[0];

      // Crear consulta SQL para insertar datos
      const insertQuery = `
        INSERT INTO dspace.investigaciones 
        (codigo, titulo, autor, dni_autor, autor2, dni_autor2, asesor, dni_asesor, orcid, facultad, titulo_grado, tipo, jurado_1, jurado_2, jurado_3, Denominacion, PalabrasClave, ocde, codigo_programa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Insertar los datos en un solo registro
      const values = [
        codigo1 + (codigo2 ? `, ${codigo2}` : ""), // Unir ambos códigos de los autores en un solo campo
        titulo, // Título de la tesis
        autor1,
        dniAutor1,
        autor2,
        dniAutor2, // DNIs concatenados
        asesorNombre, // Nombre del asesor obtenido de la tabla orcid
        dniAsesor, // DNI del asesor
        orcid, // ORCID del asesor obtenido de la tabla orcid
        facultad, // Facultad
        grado, // Grado
        tipoTrabajo, // Tipo de trabajo
        jurado1, // Jurado 1
        jurado2, // Jurado 2
        jurado3, // Jurado 3
        gradoAcademico, // Grado académico
        palabrasClave, // Palabras clave
        ocde, // Valor de OCDE obtenido
        codigoprograma, // Valor de código programa obtenido
      ];

      // Ejecutar la consulta de inserción
      await pool.query(insertQuery, values);

      // Respuesta exitosa
      res.status(200).json({ message: "Datos insertados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al insertar los datos" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
 */