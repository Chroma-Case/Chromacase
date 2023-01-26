import { Dataset, createPlaywrightRouter } from 'crawlee';
import * as fs from 'fs';
export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks }) => {
    const songs = await enqueueLinks({
		selector: 'article a.xrntp',
		label: 'SONG',
	});
	// Find a link to the next page and enqueue it if it exists.
	const lists = await enqueueLinks({
		selector: '.VECGt',
		label: 'LIST',
	});
});

router.addHandler('SONG', async ({ request, page }) => {
    await Dataset.pushData({ url: request.loadedUrl });
	await page.waitForSelector('aside div div section button[name="download"]');
	const title = await page.locator('h1').textContent()
 //   const artist = 'a';
	const artist = await page.locator('body > div.js-page.react-container > div > section > aside > div:nth-child(5) > div > section > h3:nth-child(2) > a').textContent()
	//const genre = 'b';
	const genre = await page.locator('body > div.js-page.react-container > div > section > aside > div:nth-child(6) > div > table > tbody > tr:nth-child(5) > td > div > a').textContent()
	await page.locator('aside div div section button[name="download"]').click()
	await page.waitForSelector('section.b_r17 button');
	const [ downloadMxl ] = await Promise.all([
		// Start waiting for the download
		page.waitForEvent('download'),
	    // Perform the action that initiates download
	    page.locator('section.b_r17 section section div:nth-child(3) button').click(),
	]);
	// Save downloaded file somewhere
	await downloadMxl.saveAs(`../musics/a/${title}/${title}.mxl`);

    await page.locator('body > article > section > button').click();

	await page.waitForTimeout(15000);
    await page.locator('aside div div section button[name="download"]').click()
	await page.waitForSelector('section.b_r17 button');
	const [ downloadMidi ] = await Promise.all([
		// Start waiting for the download
		page.waitForEvent('download'),
	    // Perform the action that initiates download
	    page.locator('section.b_r17 section section div:nth-child(4) button').click(),
	]);
	// Save downloaded file somewhere
	await downloadMidi.saveAs(`../musics/a/${title}/${title}.midi`);

	fs.writeFile(`../musics/a/${title}/${title}.ini`, `
[Metadata]
Name=${title}
Artist=${artist}
Genre=${genre}
Album=
	
[Difficulties]
TwoHands=0
Rhythm=0
NoteCombo=0
Arpeggio=0
Distance=0
LeftHand=0
RightHand=0
LeadHandChange=0
ChordComplexity=0
ChordTiming=0
Length=0
PedalPoint=0
Precision=0
`, () => {})
	await page.waitForTimeout(15000);
});