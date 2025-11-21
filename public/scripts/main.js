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



	// let value = { //<--- cannot send into body since body not allowed for GET/HEAD
	// 	search: getSet(),
	// }
	// value = JSON.stringify(value);
	//const string = input.value;
	// const serverResponse = await fetch(`http://localhost:3000/${string}`, {

	// });

	//const serverData = await serverResponse.json();

	// console.log('Data sent to server');
	// console.log(serverData);
	
}

form.addEventListener("submit", sendSearch);