// pages/orcid.js

import CrudTable from '../components/OcdeTable';
import Dashboard from '../components/Dashboard';
export default function OcdePage() {
  return (
    <>
     <div style={{
      marginTop: "-12px",
    }}  >
<Dashboard/>
    </div>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">CRUD - OCDE</h2>
        <CrudTable /> {/* Componente que contiene la tabla */}
      </div>
    </>
  );
}
