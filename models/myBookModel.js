module.exports = (function myBookSchema() {
	const schema = {
		word: String,
		phonetic: String,
		explains: Array,
		removed: Boolean,
		createTime: Number
	};
	const collectionName = 'dictionary';
})();