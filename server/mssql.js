import sql from 'mssql'
import { sqlConfig } from './sqlConfig.js'

// Connect to MSSQL server
export async function connectMssql(){
	try {
		console.log('Connecting to MSSQL database server...');
		await sql.connect(sqlConfig);
		console.log('MSSQL server connected successfully.');
		const result = await sql.query`SELECT 1 as testResult`;
		console.log('Query result:', result.recordset[0].testResult, 'If 1, test successful.');
	} catch (err) {
		console.error('Database Connection Failed!');
		console.error('Error Details:', err);
	} finally {
		// Closes connection pool after testing
		if (sql.globalPool) {
			await sql.close();
			console.log('Connection closed.');
		}
	}
}