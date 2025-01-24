import { useState } from "react";

import ExcelUpload from "../components/ExcelUpload";
import Dashboard from "@/components/Dashboard";

export default function CargarExcel() {
  const [uploadedFile, setUploadedFile] = useState(null); // Archivo cargado

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      backgroundColor: "#ecf0f1",
      height: "100%",
    }}>
    <Dashboard/>
      <div style={{
      flex: 1,
      overflowY: "auto",
      backgroundColor: "#ecf0f1",
      marginLeft: "270px",
      height: "100%",}}>
        <h2 className="text-2xl font-bold mb-4">Cargar Archivo Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-4"
        />
        {uploadedFile && <ExcelUpload file={uploadedFile} />}
      </div>
    </div>
  );
}
