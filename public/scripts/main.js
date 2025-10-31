"use strict";

const input = document.querySelector('input');
const btn = document.querySelector('button');

const getSet = () => {
	return input.value;
}

const sendSearch = async () => {
	let value = {
		set: getSet(),
	}
	value = JSON.stringify(value);
	
	const serverResponse = await fetch('http://localhost:3000/api', {
		method: "POST",
		body: value,
		headers: {
			"Content-Type": "application/json",
		}
	});

	const serverData = await serverResponse.json();

	console.log('Data sent to server');
	console.log(serverData);
	
}

btn.addEventListener("click", sendSearch);