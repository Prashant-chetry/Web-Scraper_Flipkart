/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');
const getValue = require('./common/info/getValue');
const WebScraperAPI = require('./class');

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
