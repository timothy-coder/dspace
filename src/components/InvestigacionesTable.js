import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Librería para leer Excel
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import "./styles.css"; // Importa tu archivo CSS si lo usas

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
  const headersmodal = {
    titulo: "Título",
    autor: "Autor",
    dni_autor: "DNI del Autor",
    autor2: "Coautor",
    dni_autor2: "DNI del Coautor",
    asesor: "Asesor",
    dni_asesor: "DNI del Asesor",
    fecha: "Fecha",
    titulo_grado: "Título de Grado",
    denominacion: "Denominación",
    facultad: "Facultad",
    tipo: "Tipo de Investigación",
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
  const [asesores, setAsesores] = useState([]);
  const [facultades, setFacultades] = useState([]);
  
  useEffect(() => {
    fetchData();
    fetchAsesores();
    fetchFacultades();
  }, []);
  
  const fetchAsesores = async () => {
    const response = await fetch("/api/asesores");
    const result = await response.json();
    setAsesores(result);
  };
  
  const fetchFacultades = async () => {
    const response = await fetch("/api/facultades");
    const result = await response.json();
    setFacultades(result);
  };

  const fetchData = async () => {
    const response = await fetch("/api/investigaciones");
    const result = await response.json();
    if (Array.isArray(result)) {
      setData(result);
    } else {
      setData([]);
    }
  };
  const handleAsesorChange = (dni) => {
    const asesorSeleccionado = asesores.find(asesor => asesor.dni === dni);
    if (asesorSeleccionado) {
      setFormData({
        ...formData,
        dni_asesor: asesorSeleccionado.dni,
        asesor: asesorSeleccionado.nombreapellido,
        orcid: asesorSeleccionado.orcid,
      });
    }
  };
  
  const handleFacultadChange = (facultad) => {
    const facultadSeleccionada = facultades.find(f => f.facultad === facultad);
    if (facultadSeleccionada) {
      setFormData({
        ...formData,
        facultad: facultadSeleccionada.facultad,
        ocde: facultadSeleccionada.ocde,
        codigo_programa: facultadSeleccionada.codigoprograma,
      });
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
      estado: ["Observado", "Por enviar", "Enviado"],
    };
  
    if (key === "dni_asesor") {
      return (
        <select
          value={formData[key]}
          onChange={(e) => handleAsesorChange(e.target.value)}
        >
          <option value="">Seleccione un DNI</option>
          {asesores.map((asesor) => (
            <option key={asesor.dni} value={asesor.dni}>
              {asesor.dni}
            </option>
          ))}
        </select>
      );
    }
  
    if (key === "facultad") {
      return (
        <select
          value={formData[key]}
          onChange={(e) => handleFacultadChange(e.target.value)}
        >
          <option value="">Seleccione una facultad</option>
          {facultades.map((facultad) => (
            <option key={facultad.facultad} value={facultad.facultad}>
              {facultad.facultad}
            </option>
          ))}
        </select>
      );
    }
  
    const isDropdown = dropdownOptions[key];
  
    return isDropdown ? (
      <select
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      >
        {isDropdown.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    );
  };
  return (
    <div style={{marginLeft:"260px"}}>
      <button class="agregar" onClick={() => setFormVisible(true)}>Agregar nueva investigación</button>
      <input type="file" onChange={handleFileUpload} />
      {formVisible && (
  <div className="modal">
    <button className="close-button" onClick={() => setFormVisible(false)}>X</button>
    <form onSubmit={handleFormSubmit}>
      {Object.keys(headersmodal).map((key) => (
        <div key={key}>
          <label>{headersmodal[key]}</label>
          {renderInput(key)}
        </div>
      ))}
      <button className="agregar" type="submit">{isEditing ? "Actualizar" : "Guardar"}</button>
      <button className="eliminar" type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
    </form>
  </div>
)}
      <table>
        <thead>
          <tr>
            {Object.keys(headers).map((key) => (
              <th key={key}>{headers[key]}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.keys(headers).map((key) => (
                <td key={key}>{item[key]}</td>
              ))}
              <td>
                <button class="editar" onClick={() => handleEdit(item)}>Editar</button>
                <button class="eliminar" onClick={() => handleDelete(item.codigo)}>Eliminar</button>
                <button class="imprimir" onClick={() => handlePrint(item)}>Imprimir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
