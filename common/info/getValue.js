module.exports = (key)=> {
	if (key && typeof key === 'string') {
		key = key.trim();
		if (key.indexOf(',') !== -1) {
			key = key.split(',');
			key = key[0] + key[1];
			return parseInt(key.slice(key.indexOf('₹') + 1, key.length), 10);
		}
		return null;
	}
};
