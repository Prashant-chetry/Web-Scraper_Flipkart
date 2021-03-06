/* eslint-disable no-undef */
const {Product} = require('./model/product/collection');

class WebScraperAPI {
	constructor(url) {
		this.url = url;
	}

	async fetchData() {

	}

	async saveProductInMongo({
		name, image, currentPrice, actualPrice, productDetail = {}, fashionProduct = false, description = ''} = {}) {
		try {
			let doc;
			if (fashionProduct) {
				doc = new Product({
					name,
					image,
					currentPrice,
					actualPrice,
					type: 'fashion',
					description,
				});
			}
			doc = new Product({
				name,
				productDetail,
				image,
				currentPrice,
				actualPrice,
				type: 'tech',
				description,
			});
			await doc.save();
		}
		catch (err) {
			console.error(new Error(`Error while saving date ${err}`));
		}
	}

	async calculateAndGetProduct() {
		// take input from user
		console.log(price, 'Price');
		const match = {
			name: {
				$exists: true,
			},
			currentPrice: {
				$exists: true,
			},
			actualPrice: {
				$exists: true,
			},
		};

		const pipline = [
			{$match: match},
			{
				$group: {
					_id: {
						name: '$name',
						currentPrice: '$currentPrice',
						actualPrice: '$actualPrice',
					},
				},
			},
			{
				$project: {
					_id: 0,
					name: '$_id.name',
					currentPrice: '$_id.currentPrice',
					actualPrice: '$_id.actualPrice',
				},
			},
		];

		const products = await Product.aggregate(pipline);
		const minProduct = []; const
			idelProduct = [];
		products.forEach((key) => { if (key.currentPrice <= price) { minProduct.push(key.currentPrice); } });
		const minPrice = Math.min(...minProduct);
		console.log(`Lowest Price Product ${minPrice}`);
		products.forEach((key) => { if (key.currentPrice >= price && key.currentPrice < maxPrice) idelProduct.push(key); });
		console.log(`Best Product under the range ${price} and ${maxPrice} is ${JSON.stringify(idelProduct)}`);
	}

	async main() {
		const price = parseInt(process.argv[4], 10);
		const maxPrice = parseInt(process.argv[5], 10);
		await this.fetchData();
		if (price && maxPrice) this.calculateAndGetProduct();
	}
}

module.exports = WebScraperAPI;
