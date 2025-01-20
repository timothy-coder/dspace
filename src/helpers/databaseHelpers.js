// helpers/databaseHelpers.js

// Función para buscar el ORCID del asesor según su DNI
async function findAsesorOrcid(dniAsesor) {
    // Aquí deberías consultar la base de datos para obtener el ORCID del asesor
    // Ejemplo de retorno simulado:
    return { nombre: 'Asesor Ejemplo', orcid: '0000-0001-2345-6789' };
  }
  
  // Función para buscar datos de OCDE según la facultad
  async function findOcdeData(facultad) {
    // Consulta simulada a la base de datos con el nombre de la facultad
    return { ocde: '12345', codigoprograma: 'ABC123' };
  }
  
  module.exports = { findAsesorOrcid, findOcdeData };
  