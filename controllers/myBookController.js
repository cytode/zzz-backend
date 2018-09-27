const dbConfig = require('../db');

function myBookController() {
	const dictionary = dbConfig.dictionary;
	this.wordList = function(req, res , next){
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
	};
	this.wordAdd = function(req , res , next){
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
	};
	this.wordRemove = function(req , res , next) {
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

	};
	this.wordFind = function(req, res, next) {
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
	};
}
module.exports = new myBookController();