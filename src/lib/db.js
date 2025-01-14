import mysql from 'mysql2/promise';

// Crear una conexión a la base de datos
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678root",
    database: "dspace",
    port: 3306
});

export default db;
