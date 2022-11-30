import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
	launchContext: {
		userDataDir: "/home/bluub/.config/chromium",
	},
	// Use the requestHandler to process each of the crawled pages.
	async requestHandler({ request, page, enqueueLinks, log }) {
		log.info(`Processing ${request.url}...`);
		if (request.label === 'SONG') {
			await Dataset.pushData({ url: request.loadedUrl });
			await page.waitForSelector(' button');
			await page.locator('aside div div section button[name="download"]').click()
			await page.waitForSelector('section.b_r17 button.HFvdW');
			const [ download ] = await Promise.all([
				// Start waiting for the download
				page.waitForEvent('download'),
			// Perform the action that initiates download
			page.locator('section.b_r17 section section div:nth-child(3) button.HFvdW').click(),
			]);
			// Wait for the download process to complete
			console.log(await download.path());
		// Save downloaded file somewhere
		await download.saveAs('a.midi');
		}
		else {
			//
			const songs = await enqueueLinks({
				selector: 'article a.xrntp',
				label: 'SONG',
			});
			// Find a link to the next page and enqueue it if it exists.
			const lists = await enqueueLinks({
				selector: '.VECGt',
				label: 'LIST',
			});
		}

	},

	// This function is called if the page processing failed more than maxRequestRetries+1 times.
	failedRequestHandler({ request, log }) {
		log.info(`Request ${request.url} failed too many times.`);
	},
	headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://musescore.com/sheetmusic?license=to_modify_commercially%2Cto_use_commercially&recording_type=public-domain']);
