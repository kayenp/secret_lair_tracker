"use strict";

import { chromium } from 'patchright'
import { test, expect } from '@playwright/test'
import sql from 'mssql'
import { sqlConfig } from '../sqlConfig.js'
import { TYPES } from 'tedious'
import { types } from 'util';
import { TYPE } from 'tedious/lib/packet.js';
import { error } from 'console';



/*
====================
Global Var
====================
*/

/*
====================
SQL helper functions
====================
*/

// Connects to new instance pool of TDS connections
async function connectSql(config=sqlConfig) {
	const sqlPool = new sql.ConnectionPool(config);
	const pool = await sqlPool.connect();
	return pool.request();
}

// Sends command to SQL Server
async function queryDb(reqObj, sqlQuery) {
	return await reqObj.query(`${sqlQuery}`)
}

/*
====================
Browser helper functions
====================
*/

// Starts Chrome
async function startBrowser() {
	const browser = await chromium.launch({
		channel: "chrome",
		headless: false,
		viewport: null
	});
	const page = await browser.newPage();
	return page;
}

// Playwright goes to URL
async function gotoPage(url, loadstate) {
	const page = await startBrowser();
	await page.goto(`${url}`);
	await page.waitForLoadState(`${loadstate}`);
	return page;
}

// Converts SQL Server DB string title to HTML anchor link
async function strToLink(string) {
	return string.toLowerCase().trim().replace(/[&?:'"!,*]/g, '').replaceAll(' ', '-');
}

// Scrapes individual Scryfall IDs from SLD group pages and inserts into DB
async function scryfallIdScrape(page, dbVal) {
		console.log('Single card scraping beginning...');
		// Creates new sql connection in preparation for database interaction
		const sqlPool = new sql.ConnectionPool(sqlConfig);
		const pool = await sqlPool.connect();
		// Creates an array populated with elements with the attribute data-card-id
		const linkArr = await page.locator(`[data-card-id]`).all();
		// Loops each element retrieving the scryfall ID and card name
		for (let i = 0; i < linkArr.length; i++) {
			console.log(linkArr[i]);
			let scryfallId = await linkArr[i].getAttribute(`data-card-id`);
			// Small try...catch block to catch locator errors and continue running function
			try {	
				var cardName = await linkArr[i].locator(`.card-grid-item-invisible-label`).innerText();
			} catch (err) {
				console.log(`Error: ${err}`);
			};
			console.log(cardName, scryfallId);
			// Creates prepared statements and performs database queries
			try {
				const ps = new sql.PreparedStatement(pool);
				ps.input('Card_Name', sql.VarChar(255));
				ps.input('Drop_Name', sql.VarChar(255));
				ps.input('Scryfall_ID', sql.VarChar(255));
				await ps.prepare("INSERT INTO missing_drops_singleCardData (Card_Name, Drop_Name, Scryfall_ID) VALUES (@Card_Name, @Drop_Name, @Scryfall_ID)");
				await ps.execute({ 
					Card_Name: cardName,
					Drop_Name: dbVal,
					Scryfall_ID: scryfallId
				});
				await ps.unprepare();
			} catch (err) {
				console.error('SQL operation failed', (err));
			};
		};
		await page.goto('https://scryfall.com/sets/sld?as=grid&order=set');
		await page.waitForLoadState(`domcontentloaded`);
		console.log('previous page...');
}

// Loops through SLD DB titles and runs scryfallIDScrape() on each title
async function retrieveFromDb(page, colVals) {
	for (let i = 0; i < colVals.length; i++) {	
		try {
			const dbVal = colVals[i].drop_name.trim();
			console.log(dbVal);
			const pattern = new RegExp(`${dbVal}`, 'i');
			const locator = page.locator(`.card-grid-header-content`);
			await locator.getByText(pattern).getByRole('link', { name: 'cards' }).click();
			await page.waitForLoadState('domcontentloaded');
			console.log("SUCCESS");
			await scryfallIdScrape(page, dbVal);
		} 
		catch (err) {
			console.log(`ERROR ${err}`);
		}
	}
	console.log('Scrape Done.');
}

// Returns the total number of records from a table
async function retrieveNumRecords(table) {
	const numRecordsObj = await queryDb(await connectSql(), `SELECT MAX (id) FROM ${table}`);
	return numRecordsObj.recordset[0][''];
}

// Loops through table column and pushes result to an array
async function retrieveColVals(maxIterations, query) {
	let dbResult = [];
	for (let i = 0; i < maxIterations; i++) {
		let result = await queryDb(await connectSql(), `${query} ${i+1}`);
		dbResult.push(result.recordset[0]);
	};
	return dbResult;
}

// Enters the group page for that SLD <---- NEED TO COMPLETE
async function openSldGroupPage(tableVals) {
	for (let i = 0; i < tableVals.length; i++) {	
		try {
			await page.locator(`#${strToLink(tableVals[i])}`).getByRole('link', { name: 'cards' }).click();
			await page.waitForLoadState('domcontentloaded');

		}
		catch (err) {
			console.log(`Error running scrapeIdByGroup: ${err}`);
		}}
}

// Scrapes SLD group headers from scryfall set:SLD page and performs DB query
async function addToTable(locArr, query) {
	for (let i = 0; i < locArr.length; i++) {
		let headerVal = await locArr[i].innerText;
		console.log(headerVal);
		headerVal = headerVal.split('•');
		try {
			await queryDb(await connectSql(), query);
		}
		catch (err) {
			console.log(`ERROR in addToTable ${err}`);
		}
	}
	console.log('Adding to table done.')
}

/*
====================
Exported functions
====================
*/
export async function sldToArr() {
	await gotoPage('https://mtg.wiki/page/Secret_Lair/Drop_Series', 'domcontentloaded')
	const rowArr = await page.locator(`.wikitable > tbody > tr`).all();
	let list = [];
	let i = 0;
	let currCard = '';
	console.log(rowArr.length);
	(async function() {
		while (i < rowArr.length) {
			try {
				const drop = (await rowArr[i].locator(`td`).nth(1).innerText()).replace(/'/g, "''");
				const release = await rowArr[i].locator(`td`).nth(3).innerText();
				const regular = await rowArr[i].locator(`td`).nth(4).innerText()
				const foil = await rowArr[i].locator(`td`).nth(5).innerText();
				currCard = drop;
				const result = await pool.request().query(`INSERT INTO TestTable (Name, ReleaseDate, Regular, Foil) VALUES ('${drop}', '${release}', '${regular}', '${foil}')`);
				console.log(drop, release, regular, foil);
			}
			catch (err) {
				console.log(`ERROR: ${err}`);
			};
			i++;
		}
		console.log('Drop titles finished');
	})();
}

export async function scrapeScryfallSLD() {
	console.log('Scraping cards...');
	const page = await gotoPage('https://scryfall.com/sets/sld?as=grid&order=set', 'domcontentloaded');
	const locArr = await page.locator('.card-grid-header-content').all();
	const query = `INSERT INTO singleCards ([drop], cardCount) VALUES ('${headerVal[0].replace(/'/g, "''")}', '${headerVal[1].replace(/CARDS/g, "").replace(/CARD/g, "").trim()}')`
	await addToTable(locArr, query);
}


export async function scrapeSingleCardsSLD() {
	console.log(sqlConfig);
	console.log('checking scryfall...');
	const page = await gotoPage('https://scryfall.com/sets/sld?as=grid&order=set', 'domcontentloaded');
	const attribute = 'data-card-id';
	const selector = `div[${attribute}]`; //`div[data-card-id]`
	//const locArr = await page.locator(`${selector}`).all();
	const query = `SELECT drop_name FROM missing_drops WHERE id =`;
	const numRecords = await retrieveNumRecords('missing_drops');
	const colVals = await retrieveColVals(numRecords, query);
	await retrieveFromDb(page, colVals);
	console.log(colVals);
 
}

// Prepared statement syntax
//===========================
// const sqlPool = new sql.ConnectionPool(sqlConfig);
// const pool = await sqlPool.connect();
// try {
// 	const ps = new sql.PreparedStatement(pool);
// 	ps.input('number', sql.Int);
// 	await ps.prepare('Select TOP @number FROM missing_drops_backup');
// 	const result = await ps.execute({ number: 3 });
// 	console.log(result.recordset);
// 	await ps.unprepare();
// } catch (err) {
// 	console.error('SQL operation failed', err);
// }