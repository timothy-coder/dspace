// pages/investigaciones.js
import Navbar from '../components/OrcidTable'; // Asumiendo que tienes un componente Navbar
import CargarPdf from '../components/CargarPdf'; // Este componente contendrá la tabla CRUD para investigaciones
import Dashboard from '../components/Dashboard';
export default function CargarPdfPage() {
  return (
    <>
     <Dashboard/>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">CRUD - Investigaciones</h2>
        <CargarPdf/> 
      </div>
    </>
  );
}
