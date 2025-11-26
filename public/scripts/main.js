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
		const response = await fetch(`http://localhost:3000/drops?search=${query}`);
		const data = await response.json();
		console.log(data);
	} catch (err) {
		console.error("ERROR during fetch", err);
	}
	createTable(data);
}

function createTable(data) {
	const docFrag = createDocumentFragment();
	const table = createElement('table');
	const thead = createElement('thead');
	const tbody = createElement('tbody');
	
}

form.addEventListener("submit", sendSearch);