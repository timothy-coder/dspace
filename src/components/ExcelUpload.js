import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function ExcelUpload({ file }) {
  const [excelData, setExcelData] = useState({
    titulo: "",
    autor1: "",
    dniAutor1: "",
    autor2: "",
    dniAutor2: "",
    asesor: "",
    dniAsesor: "",
    orcid: "",
    grado: "",
    institucion: "",
    facultad: "",
    tipoTrabajo: "",
    jurado1: "",
    jurado2: "",
    jurado3: "",
    gradoAcademico: "",
    palabrasClave: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        const getCellValue = (cell) => (firstSheet[cell] ? firstSheet[cell].v : "");

        setExcelData({
          titulo: getCellValue("C7"),
          autor1: getCellValue("C11"),
          dniAutor1: getCellValue("C14"),
          autor2: getCellValue("C16"),
          dniAutor2: getCellValue("C19"),
          asesor: getCellValue("C21"),
          dniAsesor: getCellValue("C24"),
          orcid: getCellValue("C26"),
          grado: getCellValue("C30"),
          institucion: getCellValue("B36"),
          facultad: getCellValue("C38"),
          tipoTrabajo: getCellValue("C42"),
          jurado1: getCellValue("C45"),
          jurado2: getCellValue("C46"),
          jurado3: getCellValue("C47"),
          gradoAcademico: getCellValue("C50"),
          palabrasClave: getCellValue("C53"),
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]); // Dependencia en "file"

  const handleSubmit = async () => {
    if (isSubmitting) return; // Si ya estamos enviando, no hacer nada
    setIsSubmitting(true); // Inicia el proceso de envío

    try {
      const response = await fetch("/api/insertTesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(excelData),
      });

      if (response.ok) {
        alert("Datos enviados correctamente");
      } else {
        alert("Error al enviar los datos");
      }
    } catch (error) {
      console.error(error);
      alert("Error al enviar los datos");
    } finally {
      setIsSubmitting(false); // Termina el proceso de envío
    }
  };

  return (
    <div >
      <h3 className="font-bold">Datos del archivo:</h3>
      <ul>
        <li><strong>Título:</strong> {excelData.titulo}</li>
        <li><strong>Autor 1:</strong> {excelData.autor1}</li>
        <li><strong>DNI del Autor 1:</strong> {excelData.dniAutor1}</li>
        <li><strong>Autor 2:</strong> {excelData.autor2}</li>
        <li><strong>DNI del Autor 2:</strong> {excelData.dniAutor2}</li>
        <li><strong>Asesor:</strong> {excelData.asesor}</li>
        <li><strong>DNI del Asesor:</strong> {excelData.dniAsesor}</li>
        <li><strong>ORCID:</strong> {excelData.orcid}</li>
        <li><strong>Grado:</strong> {excelData.grado}</li>
        <li><strong>Institución:</strong> {excelData.institucion}</li>
        <li><strong>Facultad:</strong> {excelData.facultad}</li>
        <li><strong>Tipo de Trabajo:</strong> {excelData.tipoTrabajo}</li>
        <li><strong>Jurado N°1:</strong> {excelData.jurado1}</li>
        <li><strong>Jurado N°2:</strong> {excelData.jurado2}</li>
        <li><strong>Jurado N°3:</strong> {excelData.jurado3}</li>
        <li><strong>Grado Académico:</strong> {excelData.gradoAcademico}</li>
        <li><strong>Palabras Clave:</strong> {excelData.palabrasClave}</li>
      </ul>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={isSubmitting} // Deshabilitar el botón mientras se envía
      >
        {isSubmitting ? "Enviando..." : "Enviar a la base de datos"}
      </button>
    </div>
  );
}
