// Criaremos configuração de conexão
// Módulo mssql
const sql = require("mssql/msnodesqlv8");

// Criar um objeto de configuração do banco
const database = {
    // user: '', 
    // password: '',
    server: 'localhost',
    database: 'GESTAO_ANIMAL',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection: true
    },
    driver: "ODBC Driver 17 for SQL Server" // win + R > odbcad32 > Drivers > ODBC Driver 17for SQL Server
}

// Criar uma função CONECTAR
async function Conectar() {
    const db = await sql.connect(database);
    console.log('Conectado!!');
    return db;
}

// Testar
Conectar();
module.exports = { sql, Conectar };
