import sql from 'mssql'
import { sqlConfig } from 'sqlConfig.js'
import { connectSql,
	getNumRecords,
	getColVals,
	queryDb
} from 'mssql'

// Converts SQL Server DB string title to HTML anchor link
//
export async function strToLink(string) {
	return string.toLowerCase().trim().replace(/[&?:'"!,*]/g, '').replaceAll(' ', '-');
}