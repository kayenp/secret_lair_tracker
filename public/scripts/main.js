"use strict";

const form = document.querySelector('form');
const input = document.querySelector('input');
const submitBtn = document.querySelector('[type="submit"]');
const main = document.querySelector('main');
const tableContainer = document.querySelector('.divTableContainer');

const getQuery = () => {
	return input.value;
}

async function sendSearch(event) {
	// Prevents page reload on form submission
	event.preventDefault();
	let query = getQuery();
	query = query.split(' ').join('+');
	console.log(query);
	try {
		const response = await fetch(`http://127.0.0.1:3000/drops?search=${query}`);
		const data = await response.json();
		console.log(data);
		createTable(data);
	} catch (err) {
		console.error("ERROR during fetch", err);
	}
	
}

function createTable(data) {
	tableContainer.innerHTML = '';
	const docFrag = document.createDocumentFragment();
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	
	// Creates table headers and populates them with header text
	for (let i = 0; i < 4; i++) {
		const th = document.createElement('th');
		th.innerText = [(() => {
			switch(i) {
				case 0: 
					return 'Card Name';
				case 1:
					return 'Drop Name';
				case 2:
					return 'Scryfall ID';
				case 3:
					return 'TCGPlayer ID';
			}
		})()];
		thead.appendChild(th);
	}

	// Populates table body with data
	for (let i = 0; i < data.length; i++) {
		const dataVal = Object.values(data[i]);
		const tr = document.createElement('tr');		
		for (let j = 0; j < 4; j++) {
			const td = document.createElement('td')
			td.innerText = dataVal[j];
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	

	table.appendChild(thead);
	table.appendChild(tbody);
	docFrag.appendChild(table);
	tableContainer.appendChild(docFrag);

	
}

form.addEventListener("submit", sendSearch);