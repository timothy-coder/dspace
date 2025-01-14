import { useState } from "react";
import Navbar from "../components/OrcidTable";


export default function CargarExcel() {
  const [uploadedFile, setUploadedFile] = useState(null); // Archivo cargado

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Cargar Archivo Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-4"
        />
        {uploadedFile && <ExcelUpload file={uploadedFile} />}
      </div>
    </>
  );
}
