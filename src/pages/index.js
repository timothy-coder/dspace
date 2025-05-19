import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from '../components/ReportPDF';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/reporte')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error al obtener datos:', err));
  }, []);

  return (
    <div>
      <h1>Generar Reporte PDF</h1>
      {data && (
        <PDFDownloadLink document={<ReportPDF data={data} />} fileName="reporte_diario.pdf">
          {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
        </PDFDownloadLink>
      )}

      {data ? (
        Object.keys(data).map((date) => (
          <div key={date}>
            <h2>Fecha: {date}</h2>
            <ul>
              {data[date].map((item, index) => (
                <li key={index}>{item.clasificador}: {item.total.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
