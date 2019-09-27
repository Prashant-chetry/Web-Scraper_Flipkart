// eslint-disable-next-line no-undef
const mongoose = require('mongoose');
global.mongooseUrl = 'mongodb://127.0.0.1:27017/webScraperFlipkart';

mongoose.connect(mongooseUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		type: Object,
	},
	productDetail: {
		type: [String],
		trim: true,
	},
	currentPrice: {
		type: Number,
		required: true,
	},
	actualPrice: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		trim: true,
	},
}, {
	timestamps: true,
});

let Product = mongoose.model('Product', productSchema);

module.exports = {
	Product,
}
;
