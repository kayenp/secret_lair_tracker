import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import { requestScryfall } from './scripts/main.js'
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from './sqlConfig.js'

const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_NAME = process.env.DB_NAME;
const __dirname = import.meta.dirname;
const __prevDir = path.join(__dirname, '..');
const __public = path.join(__prevDir, '/', 'public');
const server = http.createServer((req, res) => {});
const app = express();

// Configuration object with your MSSQL details
const config = {
    user: 'vgn07yvm', // e.g., 'sa'
    password: 'BVYNtavaEk', // The password for your SQL user
    server: 'localhost', // e.g., 'localhost' or 'SERVER\SQLEXPRESS'
    database: 'master', // The database you want to connect to
    options: {
        // May be required for local development or self-signed certs
        //trustedServerCertificate: true, 
        // Set to true if connecting to Azure SQL Database
        encrypt: true,
		trustServerCertificate: true 
    }
};

async function testConnection() {
    try {
        console.log("Attempting to connect to the database...");

        // Connect to the database using the configuration
        await sql.connect(config);

        console.log('✅ Connection Successful! Node.js server is connected to MSSQL.');
        
        // Optional: Run a simple query to confirm connectivity and permissions
        const result = await sql.query`SELECT 1 as testResult`;
        console.log('Query result:', result.recordset[0].testResult);

    } catch (err) {
        console.error('❌ Database Connection Failed!');
        console.error('Error Details:', err);
    } finally {
        // Always close the connection pool after testing
        if (sql.globalPool) {
            await sql.close();
            console.log('Connection closed.');
        }
    }
}

testConnection();


/*
====================
// MSSQL connection
====================
*/

// (async () => {
//  	try {
// 		// make sure that any items are correctly URL encoded in the connection string
// 		await sql.connect(sqlConfig)
// 		const result = await sql.query`select * from mytable where id = ${value}`
// 		console.dir(result)
// 		console.log('mssql connected');
//  	} catch (err) {
// 	// ... error checks
// 	}
// })();

/*
====================
// Express middleware
====================
*/

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

/*
====================
// Listening
====================
*/ 

app.listen(3000, () => {
	console.log('Express listening on port 3000');
})
server.listen(PORT, () => {
	console.log(`Nodejs listening on port ${PORT}`);
})