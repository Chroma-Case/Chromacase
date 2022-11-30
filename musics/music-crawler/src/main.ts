import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
	// Use the requestHandler to process each of the crawled pages.
	async requestHandler({ request, page, enqueueLinks, log }) {
		log.info(`Processing ${request.url}...`);
		if (request.label === 'SONG') {
			await Dataset.pushData({ url: request.loadedUrl });
			await page.waitForSelector('button#e81a5f7abe1f420e755794816f010f0b');
			await page.$$eval('button#e81a5f7abe1f420e755794816f010f0b', (els) => {
				// Extract text content from the actor cards
				return els.forEach((el) => el.click());
			});
			await page.waitForSelector('section.b_r17 button.HFvdW');
			await page.$$eval('section.b_r17 button.HFvdW', (els) => {
				// Extract text content from the actor cards
				return els.forEach((el) => el.click());
			});

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
