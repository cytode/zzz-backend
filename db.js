const config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.dbPath, { useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', function(err){
	console.log('error occured from db');
});
db.once('open', function dbOpen() {
	console.log('successfully opened the db');
});

exports.mongoose = mongoose;
