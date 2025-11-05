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
	
	console.log('working properly');
	page.close();
}