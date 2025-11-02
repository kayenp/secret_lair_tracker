import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import { requestScryfall } from './scripts/main.js'
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from './sqlConfig.js'

const PORT = process.env.PORT;
const __dirname = import.meta.dirname;
const __prevDir = path.join(__dirname, '..');
const __public = path.join(__prevDir, '/', 'public');
const server = http.createServer((req, res) => {});
const app = express();
const sqlPool = new sql.ConnectionPool(sqlConfig);
const pool = await sqlPool.connect();


// (async () => {
//     const pool = await sqlPool.connect();
// 	const resultSet = await pool.request().query('SELECT TOP 1 * FROM TestTable');
// 	console.log(resultSet.recordset)
//     console.log('sql global pool connection successful')
// })()

/*
====================
// Listening
====================
*/ 

app.listen(3000, () => {
	console.log('Express listening on port 3000');
});
server.listen(PORT, () => {
	console.log(`Nodejs listening on port ${PORT}`);
});

/*
====================
// MSSQL connection test
====================
*/

// connectMssql();

/*
====================
// Express middleware
====================
*/

app.use((req, res, next) => {
	console.log(req.method, req.url);
	next();
})
app.use(express.json());

/*
====================
// index.html resources
====================
*/

app.get('/:resourcePath/:resource', (req, res) => {
	const resourcePath = req.params.resourcePath;
	const resource = req.params.resource;
	res.sendFile(path.join(__public, '/', resourcePath, '/', resource));
})

/*
====================
// GET requests
====================
*/

app.get('/', (req, res) => {
	res.sendFile(path.join(__public, 'index.html'));
});

/*
====================
// API requests
====================
*/

app.get('/api', async (req, res) => {
	// const pool = await sqlPool.connect();
	const resultSet = await pool.request().query('SELECT TOP 1 * FROM TestTable');
	console.log(resultSet.recordset)
	res.send(resultSet.recordset[0]);
})

app.post('/api', async (req, res) => {
	const insertSet = await pool.request().query(`INSERT INTO TestTable (Name, ReleaseDate, Qty) VALUES ('Bill', '2025-11-01', '1')`);
	res.send(insertSet);
})

app.delete('/api', async (req, res) => {
	const deleteSet = await pool.request().query(`DELETE FROM TestTable WHERE NAME = 'Bill'`);
	res.send(deleteSet);
})

app.patch('/api', async (req, res) => {
	const updateSet = await pool.request().query(`UPDATE TestTable SET Name = 'John' WHERE Qty = 1`);
	res.send(updateSet);
})

/*
====================
// POST method
====================
*/

app.post('/api', (req, res) => {
	console.log(req.body);
	requestScryfall(req.body.set);
	res.send({ "message": "Server received request" });
})

// Shutdown SQL connection when exiting server
process.on('exit', (code) => {
	console.log(app.locals.db)
    sql.close();
	console.log('sql global pool successfully shut down');
    console.log(code)
});

/*
====================
// Reference code
====================
*/
//MSSQL server connection testing
// async function testConnection() {
//     try {
//         console.log("Attempting to connect to the database...");

//         // Connect to the database using the configuration
//         await sql.connect(sqlConfig);

//         console.log('✅ Connection Successful! Node.js server is connected to MSSQL.');
        
//         // Optional: Run a simple query to confirm connectivity and permissions
//         const result = await sql.query`SELECT 1 as testResult`;
//         console.log('Query result:', result.recordset[0].testResult);

//     } catch (err) {
//         console.error('❌ Database Connection Failed!');
//         console.error('Error Details:', err);
//     } finally {
//         // Always close the connection pool after testing
//         if (sql.globalPool) {
//             await sql.close();
//             console.log('Connection closed.');
//         }
//     }
// }

// testConnection();