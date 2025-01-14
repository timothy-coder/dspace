// pages/orcid.js
import Navbar from '../components/OrcidTable'; // Asumiendo que tienes un componente Navbar
import CrudTable from '../components/CrudTableOrcid';

export default function OrcidPage() {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">CRUD - ORCID</h2>
        <CrudTable /> {/* Componente que contiene la tabla */}
      </div>
    </>
  );
}
