import { PlaywrightCrawler, Dataset } from 'crawlee';
import { router } from './routes.js';
// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
	launchContext: {
		userDataDir: "/home/bluub/.config/chromium",
	},
//	maxConcurrency: 1,
	requestHandler: router,
	// This function is called if the page processing failed more than maxRequestRetries+1 times.
	failedRequestHandler({ request, log }) {
		log.info(`Request ${request.url} failed too many times.`);
	},
//	headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://musescore.com/sheetmusic?license=to_modify_commercially%2Cto_use_commercially&recording_type=public-domain']);
