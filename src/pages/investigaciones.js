// pages/investigaciones.js
import Navbar from '../components/OrcidTable'; // Asumiendo que tienes un componente Navbar
import CrudTable from '../components/InvestigacionesTable'; // Este componente contendrá la tabla CRUD para investigaciones
import Dashboard from '../components/Dashboard';
export default function InvestigacionesPage() {
  return (
    <>
    <div style={{
      marginTop: "-12px",
    }}  >
<Dashboard/>
    </div>
     
      <div className="">
        <h2 className="text-2xl font-bold">CRUD - Investigaciones</h2>
        <CrudTable /> {/* Componente que contiene la tabla para CRUD de investigaciones */}
      </div>
    </>
  );
}
