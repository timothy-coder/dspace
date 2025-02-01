import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Librería para leer Excel
import "./styles.css"; // Importa tu archivo CSS si lo usas
export default function DecanosTable() {
  const headers = {
    facultad: "facultad",
    grado: "grado",
    nombreapellidodecano: "nombreapellidodecano",
    denominacion: "denominacion",
    modelooficio: "modelooficio",
    estado: "estado"
  };
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ facultad: "", grado: "", nombreapellidodecano: "", denominacion: "", modelooficio: "", estado: ""});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/decanos");
    const result = await response.json();
    if (Array.isArray(result)) {
      setData(result);
    } else {
      setData([]);
    }
  };

  // Manejar la carga del archivo Excel
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
          header: ["Facultad", "Grado", "Autoridad","Denominación","Modelo","ESTADO"],
          range: 1, // Comienza desde la segunda fila (A2)
        });

        console.log("Datos extraídos del Excel:", jsonData);

        if (jsonData.length === 0) {
          alert("El archivo Excel no contiene datos válidos");
          return;
        }

        const res = await fetch("/api/decanos/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: jsonData }),
        });

        if (!res.ok) {
          throw new Error("Error al cargar los datos en el backend");
        }

        fetchData(); // Recargar los datos en la tabla
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
        await fetch("/api/decanos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/decanos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      fetchData();
      setFormVisible(false);
      setFormData({ facultad: "", grado: "", nombreapellidodecano: "" ,denominacion:"",modelooficio:"",estado:""});
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

  const handleDelete = async (facultad) => {
    try {
      await fetch("/api/decanos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultad }),
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
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
      <h1>DECANOS Management</h1>

      {/* Botón para cargar el archivo Excel */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button class="agregar" onClick={() => setFormVisible(true)}>Agregar</button>

      {/* Modal de Agregar */}
      {formVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>{isEditing ? "Editar" : "Agregar"} grado</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="FACULTAD"
                value={formData.facultad}
                onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="grado"
                value={formData.grado}
                onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="NOMBRE Y APELLIDO DE DECANO"
                value={formData.nombreapellidodecano}
                onChange={(e) => setFormData({ ...formData, nombreapellidodecano: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="DENOMINACION"
                value={formData.denominacion}
                onChange={(e) => setFormData({ ...formData, denominacion: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="MODELO DE OFICIO"
                value={formData.modelooficio}
                onChange={(e) => setFormData({ ...formData, modelooficio: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="DECANO O DIRECTOR DE INVESTIGACION"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              />
              <button class="agregar" type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
              <button class="eliminar" type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
            </form>
          </div>
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
          {Array.isArray(data) &&
            data.map((item) => (
              <tr key={item.facultad}>
                <td>{item.facultad}</td>
                <td>{item.grado}</td>
                <td>{item.nombreapellidodecano}</td>
                <td>{item.denominacion}</td>
                <td>{item.modelooficio}</td>
                <td>{item.estado}</td>
                <td>
                  <button class="editar" onClick={() => handleEdit(item)}>Editar</button>
                  <button class="eliminar" onClick={() => handleDelete(item.facultad)}>Eliminar</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};
