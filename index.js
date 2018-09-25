const restify = require('restify');
const mongojs = require("mongojs");
const connectionString = '127.0.0.1:27017/data';
const db = mongojs(connectionString, ['farm']);
const dictionary = db.collection("dictionary");

function wordList(req, res , next){
	res.header('Access-Control-Allow-Credentials', true);
    // words.find().limit(20).sort({postedOn : -1} , function(err , success){
    //     console.log('Response success '+success);
    //     console.log('Response error '+err);
    //     if(success){
    //         res.send(200 , success);
    //         return next();
    //     }else{
    //         return next(err);
    //     }
	//
    // });


	dictionary.find({"removed": false}).sort({'createTime': -1}, function(err , success){
		if(success){
			res.send(200 , success);
			// 调用处理链中的下一个处理器
			return next();
		}else{
			return next(err);
		}
	});
}
function wordAdd(req , res , next){
    const word = {};
    word.word = req.params.word;
    word.phonetic = req.params.phonetic;
    word.explains = req.params.explains;
    word.removed = false;
    word.createTime = (new Date()).getTime();
    res.header('Access-Control-Allow-Credentials', true);

	// 查找字典库，如果不存在该单词，添加。如果已存在该单词，将remove设置为true；
	dictionary.find({"word": word.word}, function(err , success){
		if(success){
			if (success.length === 0) {
				dictionary.save(word , function(err , success){
					if(success){
						res.send(200 , word);
						return next();
					}else{
						return next(err);
					}
				});
			} else {
				res.send(200 , {
					code: 401,
					message: '单词已存在'
				});
				dictionary.update({'word': word.word},{$set:{'removed': false, 'createTime': word.createTime}});
				return next();
			}
		}else{
			return next(err);
		}
	});
}
function wordRemove(req , res , next) {
	const word = req.params.word;
	res.header('Access-Control-Allow-Credentials', true);
	dictionary.update({'word': word},{$set:{'removed': true}}, function(err, success) {
		if(success){
			res.send(200 , {
				code: 0,
				message: '已删除'
			});
			return next();
		}else{
			return next(err);
		}
	});

}
function wordFind(req, res, next) {
	const word = req.params.word;
	res.header('Access-Control-Allow-Credentials', true);
	dictionary.find({"word": word}, function(err , success){
		if(success){
			res.send(200 , success);
			return next();
		}else{
			return next(err);
		}
	});
}

// 创建 server
const server = restify.createServer();
const PATH = '/dictionary';
// 生词本列表(removed == false)
server.get(PATH + '/list', wordList);
// 添加单词
server.post(PATH + '/add', wordAdd);
// 删除单词
server.put(PATH + '/remove', wordRemove);
// 查询单词
server.get(PATH + '/find', wordFind);

server.opts('/\.*/', function (req, res, next) {
	res.send(200);
	next();
});
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use((req, res, next) => {
	req.headers.accept = 'application/json';
	return next();
});
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: ['http://localhost:4200'],
});
server.pre(cors.preflight);
server.use(cors.actual);

// server.use(restify.plugins.CORS());
server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});