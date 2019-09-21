/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const {Product} = require('./model/product');

async function fetchData(){
	console.log(process.argv);
	let url;
	process.argv[2] ? url = process.argv[2] : console.log('PLEASE ENTER THE URL IN COMMAND LINE');
	try{
		const res = await axios.get(url);
		const $ = cheerio.load(res.data);
		$('div._1UoZlX').each((i, ele) => {
			let productDetail, currentPrice, actualPrice, image, name;
			image = $(ele).find('div._3BTv9X img').attr('src');
			name =$(ele).find('div._1-2Iqu').find('._3wU53n').text();
			$(ele).find('._3ULzGw .vFw0gD').each((ind, el)=>{productDetail = { [i]: $(el).text()};});
			currentPrice = $(ele).find('._6BWGkk ._1uv9Cb ._2rQ-NK').text();
			actualPrice = $(ele).find('._6BWGkk ._1uv9Cb ._3auQ3N').text();

			let doc= new Product({
				name,
				productDetail,
				image,
				currentPrice,
				actualPrice
			});
			doc.save().then(res => {
				console.log(res);
			});
		})
	}catch(e){
		throw `Error While Fetching data ${e}`;
	}
}

fetchData();