/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const {Product} = require('./model/product/collection');
const getValue = require('./common/info/getValue');
class WebScraperAPI {
	constructor(url){
		this.url = url;
	}

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
	}

	async saveProductInMongo({name, image, currentPrice, actualPrice, productDetail = {}, techProduct = true} ={}){
		try{
			let doc;
			if(fashionProduct){
				let doc = new Product({
					name,
					image,
					currentPrice,
					actualPrice
				})
			}
			doc = new Product({
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

	async calculateAndGetProduct(){
		//take input from user
		let price = parseInt(process.argv[3]);
		console.log(price, 'Price')
		const match = {
			name: {
				$exists: true,
			},
			currentPrice: {
				$exists: true,
			},
			actualPrice: {
				$exists: true
			}
		};

		const pipline = [
			{$match: match},
			{
				$group: {
					_id: {
						name: '$name',
						currentPrice: '$currentPrice',
						actualPrice: '$actualPrice'
					}
				}
			},
			{
				$project: {
					_id: 0,
					name: '$_id.name',
					currentPrice: '$_id.currentPrice',
					actualPrice: '$_id.actualPrice'
				}
			}
		];

		let products = await Product.aggregate(pipline);
		let listProduct = [];
		products.forEach( key => {
			if (key.currentPrice <= price){
				listProduct.push(key.currentPrice);

			}
		});
		// console.log(listProduct, 'List')
		let minPrice = Math.min(...listProduct);
		console.log(`Lowest Price Product ${minPrice}`);
		// let prod = {'Product Name': key.name, 'Current Price': key.currentPrice, 'Actual Price': key.actualPrice}
		// console.log(`Best Product For you ${prod}`);
		// console.log(products)
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
	new WebScraperAPI(url).main();
}

WebScraperRunning();
process.stdin.setEncoding('utf-8');
