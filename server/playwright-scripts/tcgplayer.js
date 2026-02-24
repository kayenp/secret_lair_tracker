"use strict";

import { strToLink } from 'sqlFn'
import { startBrowser, gotoPage } from 'playwrightFn'

const page = startBrowser();
await page.goto('https://www.tcgplayer.com/product/207153');
await page.waitForLoadState('domcontentloaded');
await page.getByText().first('near mint');