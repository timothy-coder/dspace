import OrcidTable from "../components/OrcidTable";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Barra lateral */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <a href="#" style={{ color: "white", textDecoration: "none" }}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "white", textDecoration: "none" }}>
                Sección 1
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "white", textDecoration: "none" }}>
                ORCID
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#ecf0f1" }}>
        <h1>ORCID Management</h1>
        <OrcidTable />
      </main>
    </div>
  );
}
