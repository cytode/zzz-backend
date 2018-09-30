module.exports = (function myBookSchema() {
	const mongoose = require('../db').mongoose;
	const schema = {
		word: String,
		phonetic: String,
		explains: Array,
		removed: Boolean,
		createTime: Number
	};
	const modelName = 'dictionary';
	const collectionName = 'dictionary';
	const myBookSchema = mongoose.Schema(schema);
	const Dictionary = mongoose.model(modelName, myBookSchema, collectionName);
	return Dictionary;
})();