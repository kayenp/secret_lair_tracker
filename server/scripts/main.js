"use strict";

export async function requestScryfall(reqSet) {
	console.log(reqSet);
	const res = await fetch(`https://api.scryfall.com/sets/${reqSet}`);
	//const res = await fetch('https://api.scryfall.com/cards/search?q=set=sld&secret&lair&monty');
	const data = await res.json();
	console.log(data);
}