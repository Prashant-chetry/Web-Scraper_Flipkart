/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const getValue = require('./common/info/getValue');
const WebScraperAPI = require('./class');

class FashionScraper extends WebScraperAPI {
	//override
	async fetchData() {
		try {
			const resp = await axios.get(this.url);
			const $ = cheerio.load(resp.data);
			$('div.IIdQZO').each((ind, ele)=>{
				let currentPrice, actualPrice, image, name, description;
				brandName = $(ele).find('div._2LFGJH > div._2B_pmu').text();
				description = $(ele).find('a._2mylT6').text();
				image = $(ele).find('img._3togXc').attr('src');
				// $(ele).find('div._1uv9Cb').each((i, el)=>{
				// 	currentPrice = $(el).firstChild.text();
				// });
				console.log({
					name,
					description,
					image,
					currentPrice,
				});
				this.saveProductInMongo({name, image, currentPrice, actualPrice, description, fashionProduct: true});
			});
		}
		catch (err) {
			console.error(new Error(`Error While fetching Data ${err}`));
		}
	}
}

module.exports = FashionScraper;
