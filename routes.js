module.exports = function(app) {
	const myBook = require('./controllers/myBookController');

	const PATH = '/dictionary';
	// 生词本列表(removed == false)
	app.get(PATH + '/list', myBook.wordList);
	// 添加单词到生词本（先添加到本地字典，再添加到生词库，{word: 'xxx'}）
	app.post(PATH + '/addToBook', myBook.wordAddToBook);
	// 添加单词到本地字典 （不操作生词本）
	app.post(PATH + '/addToDictionary', myBook.wordAddToDictionary);
	// 删除单词
	app.put(PATH + '/remove', myBook.wordRemove);
	// 查询单词
	app.get(PATH + '/find', myBook.wordFind);
	app.opts('/\.*/', function (req, res, next) {
		res.send(200);
		next();
	});
};