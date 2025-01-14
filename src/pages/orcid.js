// pages/orcid.js
import Navbar from '../components/OrcidTable'; // Asumiendo que tienes un componente Navbar
import CrudTable from '../components/OrcidTable';
import Dashboard from '../components/Dashboard';
export default function OrcidPage() {
  return (
    <>
     <Dashboard/>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">CRUD - ORCID</h2>
        <CrudTable /> {/* Componente que contiene la tabla */}
      </div>
    </>
  );
}
