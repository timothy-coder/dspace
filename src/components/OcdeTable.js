import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Librería para leer Excel

export default function OcdeTable() {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ facultad: "", ocde: "", codigoprograma: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/ocde");
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
          header: ["facultad", "ocde", "codigoprograma"],
          range: 1,
        });

        if (jsonData.length === 0) {
          alert("El archivo Excel no contiene datos válidos");
          return;
        }

        const res = await fetch("/api/ocde/upload", {
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
        await fetch("/api/ocde", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/ocde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      fetchData();
      setFormVisible(false);
      setFormData({ facultad: "", ocde: "", codigoprograma: "" });
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
      await fetch("/api/ocde", {
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
      <h1>Manejo de OCDE</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button className="agregar" onClick={() => setFormVisible(true)}>Agregar</button>

     
      {formVisible && (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      
      <button style={styles.closeButton} onClick={() => setFormVisible(false)}></button>

      <h2>{isEditing ? "Editar" : "Agregar"} OCDE</h2>
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
          placeholder="Ocde"
          value={formData.ocde}
          onChange={(e) => setFormData({ ...formData, ocde: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="CODIGO PROGRAMA"
          value={formData.codigoprograma}
          onChange={(e) => setFormData({ ...formData, codigoprograma: e.target.value })}
          required
        />
        <button className="agregar" type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
        <button className="eliminar" type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
      </form>
    </div>
  </div>
)}


      <table>
        <thead>
          <tr>
            <th>FACULTAD</th>
            <th>OCDE</th>
            <th>CODIGO PROGRAMA</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item) => (
              <tr key={item.facultad}>
                <td>{item.facultad}</td>
                <td>{item.ocde}</td>
                <td>{item.codigoprograma}</td>
                <td>
                  <button className="editar" onClick={() => handleEdit(item)}>Editar</button>
                  <button className="eliminar" onClick={() => handleDelete(item.facultad)}>Eliminar</button>
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
    position: "relative", // Para que el botón "X" se posicione correctamente
  },
  closeButton: {
    position: "absolute",
    right: "5px",
    background: "red",
    color: "white",
    width: "20px",
    height: "30px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "25px",
    textAlign: "center",
  },
};
