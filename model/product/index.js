// eslint-disable-next-line no-undef
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/webScraperFlipkart';
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
// let Schema = ();
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	image: {
		type: Object,
	},
	productDetail: {
		type: Object,
		trim: true,
	},
	currentPrice: {
		type: String,
		required: true,
	},
	actualPrice: {
		type: String,
		required: true,
	},
	createdAt: {
	type: Date,
	required: true,
	default: Date.now()
	}
});

let Product = mongoose.model('Product', productSchema);

module.exports = {
	Product,
}