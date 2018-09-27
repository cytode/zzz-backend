const config = require('./config');
const mongojs = require("mongojs");
const db = mongojs(config.dbPath, ['farm']);
module.exports = {
		dictionary: db.collection("dictionary")
};
