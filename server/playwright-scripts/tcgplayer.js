"use strict";

import { strToLink } from 'sqlFn'
import { startBrowser, gotoPage } from 'playwrightFn'

(await gotoPage('https://tcgplayer.com/product/205237'))();
