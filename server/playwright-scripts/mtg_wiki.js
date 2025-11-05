"use strict";

import { chromium } from 'patchright';
import { test, expect } from '@playwright/test';

export async function sldToArr() {
	const browser = await chromium.launch({
		channel: "chrome",
		headless: false,
		viewport: null
	});
	const page = await browser.newPage();
	await page.goto('https://mtg.wiki/page/Secret_Lair/Drop_Series');
	await expect(page).toHaveTitle('Secret Lair/Drop Series - Magic: The Gathering Wiki');
	const list = [];
	let i = 0;
	let lastEntry = '';
	while (lastEntry != 'Missing cards'){
		const drop = await page.locator(`css=.wikitable > tbody > tr:nth-child(${i+2}) > td:nth-child(2)`).innerText();
		const release = await page.locator(`css=.wikitable > tbody > tr:nth-child(${i+2}) > td:nth-child(4)`).innerText();
		const nonFoil = await page.locator(`css=.wikitable > tbody > tr:nth-child(${i+2}) > td:nth-child(5)`).innerText();
		const foil = await page.locator(`css=.wikitable > tbody > tr:nth-child(${i+2}) > td:nth-child(6)`).innerText();
		list.push({
			drop: drop,
			release: release,
			normal: nonFoil,
			foil: foil
		});
		lastEntry = drop;
		console.log(lastEntry, '<-- lastEntry')
		i++;
	}
	page.close();
	console.log(list);
}
