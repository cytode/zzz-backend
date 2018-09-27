module.exports = function(app) {
	const myBook = require('./controllers/myBookController');

	const PATH = '/dictionary';
	// 生词本列表(removed == false)
	app.get(PATH + '/list', myBook.wordList);
	// 添加单词
	app.post(PATH + '/add', myBook.wordAdd);
	// 删除单词
	app.put(PATH + '/remove', myBook.wordRemove);
	// 查询单词
	app.get(PATH + '/find', myBook.wordFind);
	app.opts('/\.*/', function (req, res, next) {
		res.send(200);
		next();
	});
};