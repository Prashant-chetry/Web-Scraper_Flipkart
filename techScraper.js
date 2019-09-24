/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const getValue = require('./common/info/getValue');
const WebScraperAPI = require('./class');

class TechScraper extends WebScraperAPI {
	async fetchData(){
		try{
			console.log(this.url, 'URL')
			const res = await axios.get(this.url);
			const $ = cheerio.load(res.data);
			//select the item
			$('div._1UoZlX').each((i, ele) => {
				let productDetail = [], currentPrice, actualPrice, image, name;
				image = $(ele).find('div._3BTv9X img').attr('src');
				name =$(ele).find('div._1-2Iqu').find('._3wU53n').text();
				$(ele).find('._3ULzGw .vFw0gD .tVe95H').each((ind, el) => {
					console.log($(el).text());
					productDetail.push($(el).text());
				});
				currentPrice = getValue($(ele).find('._6BWGkk ._1uv9Cb ._2rQ-NK').text());
				actualPrice = getValue($(ele).find('._6BWGkk ._1uv9Cb ._3auQ3N').text());
				
				this.saveProductInMongo({name, image, currentPrice, actualPrice, productDetail});
				console.log({
					name,
					image,
					currentPrice,
					actualPrice,
					productDetail
				});
			})
		}catch(e){
			console.error(new Error(`Error while fetching data ${e}`))
		}
	return;
	}
}

module.exports = TechScraper;