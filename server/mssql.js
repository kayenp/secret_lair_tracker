import sql from 'mssql'
import { sqlConfig } from './sqlConfig.js'

// Connects to SQL Server
//
export async function connectSql(config=sqlConfig) {
	const sqlPool = new sql.ConnectionPool(config);
	let pool = await sqlPool.connect();
	return pool;
}

// Sends command to SQL Server
//
export async function queryDb(connection, sqlQuery) {
	const request = connection.request();
	return await request.query(`${sqlQuery}`)
}

// Returns the total number of records from a table
//
export async function getNumRecords(query) {
	console.log('Getting number of records from database...')
	const numRecordsObj = await queryDb(await connectSql(), query);
	console.log(`Records count complete. Length = ${numRecordsObj.recordset.length}`);
	return numRecordsObj.recordset.length;
}

// Loops through table column and pushes result to an array
//
export async function getColVals(maxIterations, query) {
	console.log('Getting column values...');
	let dbResult = [];
	for (let i = 0; i < maxIterations; i++) { // <--- change back to maxIterations
		let result = await queryDb(await connectSql(), `${query}`);
		console.log(result.recordset[i]["scryfall_id"]);
		dbResult.push(result.recordset[i]["scryfall_id"]);
	};
	return dbResult;
}

// Prepared statement function
//
export async function createSqlPs(query, paramObj, inputStatements) {
	const pool = connectSql();
	try {
		const ps = new sql.PreparedStatement(pool);
		for (let i = 0; i < inputStatements.length; i++) {
			(() => {
				inputStatements[i];
			})(); // does this work???
		};
		await ps.prepare(query);
		await ps.execute(paramObj);
		await ps.unprepare();
	} catch (err) {
		console.error('Error during prepared statement', err);
	};
};

createSqlPs('SELECT TOP (@number) FROM @table', {number: 5, table: 'TestTable'}, [ps.input('number', INT), ps.input('table', sql.VarChar(255))]);

