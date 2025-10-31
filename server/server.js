import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import { requestScryfall } from './scripts/main.js'
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from './sqlConfig.js'

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_PWD = process.env.DB_PWD;
const __dirname = import.meta.dirname;
const __prevDir = path.join(__dirname, '..');
const __public = path.join(__prevDir, '/', 'public');
const server = http.createServer((req, res) => {});
const app = express();

// MSSQL connection
(async () => {
 try {
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  const result = await sql.query`select * from mytable where id = ${value}`
  console.dir(result)
 } catch (err) {
  // ... error checks
 }
})()

// Express middleware
app.use(express.json());

// index.html resources
app.get('/:resourcePath/:resource', (req, res) => {
	const resourcePath = req.params.resourcePath;
	const resource = req.params.resource;
	res.sendFile(path.join(__public, '/', resourcePath, '/', resource));
})

// GET requests
app.get('/', (req, res) => {
	res.sendFile(path.join(__public, 'index.html'));
});

// API requests

	// POST method
app.post('/api', (req, res) => {
	console.log(req.body);
	requestScryfall(req.body.set);
	res.send({ "message": "Server received request" });
})

app.listen(3000, () => {
	console.log('Express listening on port 3000');
})
server.listen(PORT, () => {
	console.log(`Nodejs listening on port ${PORT}`);
})