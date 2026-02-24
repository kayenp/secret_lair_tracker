import { chromium } from 'patchright'

// Starts Chrome
//
export async function startBrowser() {
	const browser = await chromium.launch({
		channel: "chrome",
		headless: false,
		viewport: null
	});
	const page = await browser.newPage();
	return page;
}

// Playwright goes to URL
//
export async function gotoPage(url, loadstate) {
	const page = await startBrowser();
	await page.goto(`${url}`);
	await page.waitForLoadState(`${loadstate}`);
}