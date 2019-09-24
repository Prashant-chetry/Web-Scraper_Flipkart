/* eslint-disable no-undef */
const TechScraper = require('./techScraper');
const FashionScraper = require('./fashionScraper');

const ScraperApi = {
	'tech': TechScraper,
	'fashion': FashionScraper
};

function WebScraperRunning(){
	let url = process.argv[2];
	let scraperCho = process.argv[3];
	console.log(scraperCho)
	if(!url && typeof url !== 'string') return console.error(new Error('Url not enter or Url not String'));
	if(!scraperCho && typeof scraperCho !== 'string') return console.error(new Error('Scraper not enter or Scraper not String'));
	if(scraperCho !== 'tech' && scraperCho !== 'fashion') return console.log(new Error('Choice tech or fashion for scraping'))
	// new WebScraperAPI(url).main();
	new ScraperApi[scraperCho](url).main();
}

WebScraperRunning();
process.stdin.setEncoding('utf-8');