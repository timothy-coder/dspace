// components/Dashboard.js

import Link from 'next/link';
import { useRouter } from 'next/router';
import OrcidTable from "../components/OrcidTable"; // Asegúrate de tener este componente

const Dashboard = () => {
  const router = useRouter();

  // Obtén la ruta activa
  const { pathname } = router;

  // Mostrar contenido según la ruta activa
  const renderContent = () => {
    switch (pathname) {
      case "/investigaciones":
        return <InvestigacionesTable/>; // Aquí puedes incluir el componente para esa ruta
      case "/orcid":
        return <OrcidTable />; // Aquí puedes incluir el componente ORCID
      default:
        return <div>Bienvenido al Dashboard</div>; // Contenido predeterminado
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Barra lateral */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          position: "fixed", // Fija la barra lateral
          height: "100vh", // Asegura que la barra lateral ocupe toda la altura de la ventana
        }}
      >
        <h2>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/investigaciones" style={{ color: "white", textDecoration: "none" }}>
                Lista de Títulos
              </Link>
            </li>
            <li>
              <Link href="/orcid" style={{ color: "white", textDecoration: "none" }}>
                Lista de ORCID
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      
    </div>
  );
};

export default Dashboard;
