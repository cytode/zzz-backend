module.exports = function(app) {
	const myBook = require('./controllers/myBookController');

	const PATH = '/dictionary';
	// 单词列表 type === book 生词本， type === dictionary 字典
	app.get(PATH + '/list', myBook.wordList);
	// 添加单词到生词本（先添加到本地字典，再添加到生词库，{word: 'xxx'}）
	app.post(PATH + '/addToBook', myBook.wordAddToBook);
	// 添加单词到本地字典 （不操作生词本）
	app.post(PATH + '/addToDictionary', myBook.wordAddToDictionary);
	// 从生词本删除单词
	app.put(PATH + '/remove', myBook.wordRemove);
	// 从字典删除单词
	app.del(PATH + '/removeFromDictionary', myBook.wordRemoveFromDictionary);
	// 查询单词
	app.get(PATH + '/find', myBook.wordFind);
	app.opts('/\.*/', function (req, res, next) {
		res.send(200);
		next();
	});
};