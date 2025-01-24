import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Librería para leer Excel

/*import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";*/
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";


export default function InvestigacionesTable() {
  const headers = {
    codigo: "Código",
    titulo: "Título",
    autor: "Autor",
    dni_autor: "DNI del Autor",
    autor2: "Coautor",
    dni_autor2: "DNI del Coautor",
    asesor: "Asesor",
    dni_asesor: "DNI del Asesor",
    orcid: "ORCID",
    fecha: "Fecha",
    titulo_grado: "Título de Grado",
    denominacion: "Denominación",
    facultad: "Facultad",
    ocde: "OCDE",
    tipo: "Tipo de Investigación",
    codigo_programa: "Código del Programa",
    porcentaje_similitud_oti: "Similitud OTI",
    porcentaje_similitud_asesor: "Similitud Asesor",
    jurado_1: "Jurado 1",
    jurado_2: "Jurado 2",
    jurado_3: "Jurado 3",
    autoridad_firmante: "Autoridad Firmante",
    numero_oficio_referencia: "N° de Oficio de Referencia",
    autorizacion: "Autorización",
    denominacion_si_no: "Denominación",
    titulo_si_no: "Título",
    tipo_tesis_si_no: "Tipo de Tesis",
    porcentaje_reporte_tesis_si_no: "Reporte Tesis",
    observaciones: "Observaciones",
    url: "URL",
    numero_oficio: "N° de Oficio",
    palabrasclave: "Palabras Clave",
    estado: "Estado",
  };
  
  const initialFormState = {
    codigo: "",
    titulo: "",
    autor: "",
    dni_autor: "",
    autor2: "",
    dni_autor2: "",
    asesor: "",
    dni_asesor: "",
    orcid: "",
    fecha: "",
    titulo_grado: "",
    denominacion: "",
    facultad: "",
    ocde: "",
    tipo: "",
    codigo_programa: "",
    porcentaje_similitud_oti: "",
    porcentaje_similitud_asesor: "",
    jurado_1: "",
    jurado_2: "",
    jurado_3: "",
    autoridad_firmante: "",
    numero_oficio_referencia: "",
    autorizacion: "",
    denominacion_si_no: "",
    titulo_si_no: "",
    tipo_tesis_si_no: "",
    porcentaje_reporte_tesis_si_no: "",
    observaciones: "",
    url: "",
    numero_oficio: "",
    palabrasclave: "",
    estado: "",
  };

  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/investigaciones");
    const result = await response.json();
    if (Array.isArray(result)) {
      setData(result);
    } else {
      setData([]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
        console.log("Datos extraídos del Excel:", jsonData);

        if (jsonData.length === 0) {
          alert("El archivo Excel no contiene datos válidos");
          return;
        }

        const processedData = jsonData.map((row) => ({
          // Procesar los datos de acuerdo con la estructura de tu archivo
        }));

        const res = await fetch("/api/investigaciones/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: processedData }),
        });

        const responseText = await res.text();
        if (!res.ok) {
          console.error("Error en la respuesta del servidor:", responseText);
          alert(`Error al cargar los datos en el backend: ${responseText}`);
        } else {
          alert("Carga exitosa!");
        }
      } catch (error) {
        console.error("Error al procesar el archivo Excel:", error);
        alert("Error al cargar los datos");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch("/api/investigaciones", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/investigaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      fetchData();
      setFormVisible(false);
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleDelete = async (codigo) => {
    try {
      await fetch("/api/investigaciones", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  
  
  /*const handlePrint = async (item) => {
    // Cargar las imágenes como blobs
    const escudoBlob = await fetch("URL_DE_LA_IMAGEN_ESCUDO").then((res) =>
      res.blob()
    );
    const firmaBlob = await fetch("URL_DE_LA_IMAGEN_FIRMA").then((res) =>
      res.blob()
    );
  
    // Crear el documento Word con imágenes y diseño
    const doc = new Document({
      sections: [
        {
          children: [
            // Encabezado con imagen y texto
            new Paragraph({
              children: [
                new ImageRun({
                  data: escudoBlob,
                  transformation: { width: 100, height: 100 },
                }),
                new TextRun({
                  text: "UNIVERSIDAD NACIONAL DEL CENTRO DEL PERÚ",
                  bold: true,
                  size: 28,
                  allCaps: true,
                }),
                new TextRun({
                  text: "OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN",
                  bold: true,
                  size: 28,
                  allCaps: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: "Año de la recuperación y consolidación de la economía peruana",
              alignment: AlignmentType.CENTER,
              italics: true,
            }),
  
            // Fecha
            new Paragraph({
              text: `Huancayo, ${item.fecha}`,
              alignment: AlignmentType.RIGHT,
            }),
  
            // Título del oficio
            new Paragraph({
              text: `OFICIO N° ${item.numero_oficio}`,
              bold: true,
              size: 24,
              alignment: AlignmentType.CENTER,
            }),
  
            // Destinatario
            new Paragraph({
              text: `Ph. D. Dr.\n${item.decano}\nDECANO DE LA FACULTAD DE INGENIERÍA CIVIL\nPRESENTE.`,
            }),
  
            // Asunto
            new Paragraph({
              text: "\nASUNTO: REMITO URL GENERADO EN EL REPOSITORIO INSTITUCIONAL PARA TRÁMITE DE LA OBTENCIÓN DEL DIPLOMA",
              bold: true,
            }),
            new Paragraph(`REFERENCIA: OFICIO N° ${item.oficio_referencia}`),
  
            // Cuerpo del oficio
            new Paragraph({
              text: `Es grato dirigirme a usted para saludarlo cordialmente y a la vez informarle que se ha generado la URL de acuerdo a lo solicitado con el documento de referencia para proceder con el trámite correspondiente de la obtención del diploma, según el siguiente detalle:`,
            }),
  
            // Tabla de contenido
            new Table({
              rows: [
                // Fila de encabezados
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("N°")],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("CÓDIGO")],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("TÍTULO DE LA TESIS")],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("AUTOR")],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("SIMILITUD")],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("TÍTULO/GRADO")],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("FACULTAD")],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("URL")],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Fila de datos
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("1")],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.codigo)],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.titulo)],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(`${item.autor} (DNI: ${item.dni_autor})`),
                      ],
                    }),
                    new TableCell({
                      children: [new Paragraph(`${item.similitud}%`)],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.titulo_grado)],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.facultad)],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.url)],
                    }),
                  ],
                }),
              ],
            }),
  
            // Pie del oficio
            new Paragraph({
              text: `\nSin otro en particular, se aprovecha la ocasión para expresarle las muestras de mi distinguida consideración y agradecimiento por la atención prestada.\n\nAtentamente,`,
            }),
            // Firma con imagen
            new Paragraph({
              children: [
                new ImageRun({
                  data: firmaBlob,
                  transformation: { width: 200, height: 50 },
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `${item.autoridad_firmante}\n${item.cargo_autoridad}`,
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });
  
    // Generar archivo y descargar
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `OFICIO N° ${item.numero_oficio}-2025-JEF-OTI-RI-UNCP.docx`);
    });
  };*/
  const JSZip = require("jszip");
  const PizZip = require("pizzip");
  const Docxtemplater = require("docxtemplater");
  
  const handlePrint = (item) => {
    // Verifica si falta el campo 'oficio_referencia'
    if (!item.oficio_referencia) {
      console.warn('Falta el campo "oficio_referencia" en el objeto "item"');
    }
  
    // Usar fetch para obtener el archivo binario
    fetch("/images/modelo.docx")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el archivo");
        }
        return response.arrayBuffer();
      })
      .then((content) => {
        // Crear un PizZip a partir del contenido del archivo
        const zip = new PizZip(content);
  
        // Crear una instancia de Docxtemplater con el archivo cargado
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
  
        // Pasar los datos dinámicos al documento
        doc.setData({
          fecha: item.fecha,
          numero_oficio: item.numero_oficio,
          decano: item.asesor,
          oficio_referencia: item.numero_oficio_referencia || 'No disponible',  // Valor por defecto
          codigo: item.codigo,
          titulo: item.titulo,
          autor: item.autor,
          dni_autor: item.dni_autor,
          similitud: item.porcentaje_similitud_oti,
          titulo_grado: item.titulo_grado,
          facultad: item.facultad,
          url: item.url,
          autoridad_firmante: item.asesor,
          cargo_autoridad: item.asesor,
        });
  
        try {
          // Renderizar el documento con los datos
          doc.render();
        } catch (renderError) {
          console.error("Error al renderizar el documento:", renderError);
          return;
        }
  
        // Exportar el archivo modificado
        const output = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
  
        // Descargar el archivo generado
        saveAs(output, `OFICIO N° ${item.numero_oficio}-2025-JEF-OTI-RI-UNCP.docx`);
      })
      .catch((error) => {
        console.error("Error al cargar el archivo:", error);
      });
  };
  
  

  

  const renderInput = (key) => {
    const dropdownOptions = {
      tipo: ["Tesis", "Proyecto de investigación", "Trabajo de suficiencia profesional"],
      autorizacion: ["Abierta", "Restringido", "Confidencial"],
      denominacion_si_no: ["Si", "No"],
      titulo_si_no: ["Si", "No"],
      tipo_tesis_si_no: ["Si", "No"],
      porcentaje_reporte_tesis_si_no: ["Si", "No"],
      estado: ["Por enviar", "Observado", "Enviado"],
    };

    if (dropdownOptions[key]) {
      return (
        <select
          key={key}
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        >
          <option value="">Seleccionar</option>
          {dropdownOptions[key].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (key === "fecha") {
      return (
        <input
          key={key}
          type="date" // Tipo de entrada para el calendario
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      );
    }

    return (
      <input
        key={key}
        type="text"
        placeholder={key}
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    );
  };

  return (
    <div
      style={{
        flex: 1,
        marginTop: "-60px",
        overflowY: "auto",
        backgroundColor: "#ecf0f1",
        marginLeft: "260px",
        height: "100%",
      }}
    >
      <h1>Gestión de Investigaciones</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={() => setFormVisible(true)}>Agregar</button>

      {formVisible && (
        <form onSubmit={handleFormSubmit}>
          {Object.keys(initialFormState).map((key) => renderInput(key))}
          <button type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
          <button type="button" onClick={() => setFormVisible(false)}>
            Cancelar
          </button>
        </form>
      )}

      <table>
      <thead>
        <tr>
          {Object.keys(initialFormState).map((key) => (
            <th key={key}>{headers[key]}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>

        <tbody>
          {Array.isArray(data) &&
            data.map((item) => (
              <tr key={item.codigo}>
                {Object.keys(initialFormState).map((key) => (
                  <td key={key}>{item[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.codigo)}>Eliminar</button>
                  <button onClick={() => handlePrint(item)}>Imprimir</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
