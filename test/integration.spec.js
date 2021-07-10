const puppeteer = require('puppeteer');

const sleep = (time) => new Promise(r => setTimeout(r, time));

describe('Integration', () => {
	let page;

	before('Init', async () => {
		page = await init();
	});

	after('Close page', async () => {
		await page.close();
	});

	it('should test tabs', async () => {
		await page.click('[aria-controls="home"]');
		await page.click('[aria-controls="profile"]');
		//check text inside 2nd tab
		await page.$x("//h5[contains(., 'MAKING DOG FOOD PART OF A BALANCED DIET')]");
		await page.click('[aria-controls="messages"]');
		await page.click('[aria-controls="profile"]');
		await page.click('[aria-controls="home"]');
	});

	it.only('should test form', async () => {
		await page.click('form.form-horizontal [type=email]');
		await page.keyboard.type('thisisnotvalidemail', { delay: 10 }); // Types slower, like a user
		const text = `Please include an '@' in the email address. 'thisisnotvalidemail' is missing an '@'.`;
		await page.$x(`//li[contains(., "${text}")]`);
	});
});


async function init() {
	console.log('Starting Chrome with puppeteer');
	const browser = await puppeteer.launch({
		headless: false,
		devtools: false,
		slowMo: 500, //Make it more human-like
		args: [
			// Required for Docker version of Puppeteer
			'--no-sandbox',
			'--disable-setuid-sandbox',
			// This will write shared memory files into /tmp instead of /dev/shm,
			// because Docker’s default for /dev/shm is 64MB
			'--disable-dev-shm-usage',
			'--window-size=1920,1080'
		]
	});

	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080,
	})
	await page.setUserAgent(
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
	);
	await page.goto(`http://localhost/index.html`, {waitUntil: 'domcontentloaded'});
	return page;
}
