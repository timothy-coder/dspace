
import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Librería para leer Excel

export default function InvestigacionesTable() {
  const initialFormState = {
    codigo: "",
    titulo: "",
    autor: "",
    dni_autor: "",
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: Object.keys(initialFormState),
          range: 1,
        });

        console.log("Datos extraídos del Excel:", jsonData);

        if (jsonData.length === 0) {
          alert("El archivo Excel no contiene datos válidos");
          return;
        }

        const res = await fetch("/api/investigaciones/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: jsonData }),
        });

        if (!res.ok) {
          throw new Error("Error al cargar los datos en el backend");
        }

        fetchData();
        alert("Carga exitosa!");
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
    
    <div style={{
        flex: 1,
        padding: "0px",
        backgroundColor: "#ecf0f1",
        marginLeft: "300px", // Desplaza el contenido principal para que no se superponga con la barra lateral
      }}>
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
              <th key={key}>{key}</th>
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
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
