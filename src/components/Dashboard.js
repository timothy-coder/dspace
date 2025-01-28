import Link from 'next/link';
import { useRouter } from 'next/router';
import OrcidTable from "../components/OrcidTable";
import OcdeTable from '../components/OcdeTable';
import ExcelUpload from './ExcelUpload';
import InvestigacionesTable from './InvestigacionesTable';
import PdfUpload from './CargarPdf';
const Dashboard = () => {
  const router = useRouter();

  // Obtén la ruta activa
  const { pathname } = router;

  // Mostrar contenido según la ruta activa
  const renderContent = () => {
    switch (pathname) {
      case "/":
        return <div>Bienvenido al Dashboard</div>; // Contenido para la página de inicio
      case "/investigaciones":
        return <InvestigacionesTable/>; // Solo se muestra el componente InvestigacionesTable en esta ruta
      case "/orcid":
        return <OrcidTable />;
      case "/ocde":
        return <OcdeTable />;
      case "/cargar-excel":
        return <ExcelUpload />;
        case "/cargarpdf":
        return <PdfUpload />;
      default:
        return <div>Página no encontrada</div>; // Contenido para rutas desconocidas
    }
  };

  return (
      <div
        style={{
          width: "250px",
          marginTop: "-8px",
          marginLeft: "-8px",
          backgroundColor: "#2c3e50",
          color: "white",
          paddingLeft: "10px",
          position: "fixed",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h2>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>
                Inicio
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/investigaciones" style={{ color: "white", textDecoration: "none" }}>
                Lista de Títulos
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/orcid" style={{ color: "white", textDecoration: "none" }}>
                Lista de ORCID
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/ocde" style={{ color: "white", textDecoration: "none" }}>
                Lista de OCDE
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/cargar-excel" style={{ color: "white", textDecoration: "none" }}>
                Carga de Modelo Excel
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link href="/cargarpdf" style={{ color: "white", textDecoration: "none" }}>
                Carga de Modelo PDF
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      
    
  );
};

export default Dashboard;
