"use strict";

const form = document.querySelector('form');
const input = document.querySelector('input');
const submitBtn = document.querySelector('[type="submit"]');

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
	const docFrag = document.createDocumentFragment();
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	
}

form.addEventListener("submit", sendSearch);