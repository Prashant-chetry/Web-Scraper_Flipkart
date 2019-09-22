/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const {Product} = require('./model/product');
class WebScraperAPI {
	constructor(url){
		this.url = url;
	}

	async fetchData(){
		try{
			const res = await axios.get(this.url);
			const $ = cheerio.load(res.data);
			//select the item
			$('div._1UoZlX').each((i, ele) => {
				let productDetail, currentPrice, actualPrice, image, name;
				image = $(ele).find('div._3BTv9X img').attr('src');
				name =$(ele).find('div._1-2Iqu').find('._3wU53n').text();
				$(ele).find('._3ULzGw .vFw0gD').each((ind, el)=>{productDetail = { [i]: $(el).text()};});
				currentPrice = $(ele).find('._6BWGkk ._1uv9Cb ._2rQ-NK').text();
				actualPrice = $(ele).find('._6BWGkk ._1uv9Cb ._3auQ3N').text();
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
	}

	async saveProductInMongo({name, image, currentPrice, actualPrice, productDetail = {}} ={}){
		try{
		let doc = new Product({
			name,
			productDetail,
			image,
			currentPrice,
			actualPrice
		});

		await doc.save();
		}catch(err){
			console.error(new Error(`Error while saving date ${err}`))
		}
	}

	calculateAndGetProduct(){
		//take input from user

		const match = {name: {$exists: true, }, currentPrice: {$lte: '$actualPrice'}, actualPrice:{$gte: '$currentPrice'}};
		const pipline = [
			{$match: match},
			{$group: {_id: {name: '$name', currentPrice: '$currentPrice', actualPrice: '$actualPrice'}}},
			{$project: {_id: 0}}
		];
		let products = Product.aggregate(pipline);
		console.log(products)
	}

	async main(){
		await this.fetchData();
		this.calculateAndGetProduct();
	}
}

class Fashion extends WebScraperAPI{
	//override
	async fetchData(){
		try{
			const resp = await axios.get(this.url);
			const $ = cheerio.load(resp.data);

		}catch(err){
			console.error(new Error(`Error While fetching Data ${err}`))
		}
	}
}

function WebScraperRunning(){
	let url = process.argv[2];
	if(!url && typeof url !== 'string') return console.error(new Error('Url not enter or url not in String'));
	console.log(url)
	new WebScraperAPI(url).main();
}

WebScraperRunning();