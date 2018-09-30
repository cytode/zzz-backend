const Dictionary = require('../models/myBookModel');
const config = require('../config');


function myBookController() {
	/**
	 * 获得生词本列表
	 * GET
	 * params: { currentPage: xxx}
	 * res: {
	 * 	code: 0,
	 * 	list: [{
	 * 		word: xxx,
	 * 		phonetic: xxx,
	 * 		explains: xxx,
	 * 		removed: false,
	 * 		createTime: xxx
	 * 	}],
	 * 	totalPage: xxx,
	 * 	totalItem: xxx
	 * }
	 * 首先查询 removed == false 的数目，其次按 pageSize === 50 进行返回。
	 * **/
	this.wordList = function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		const pageSize = 50;
		let currentPage = req.params.currentPage;
		const type = req.params.type || 'book';
		const queryDict = {
			book: {removed: false},
			dictionary: {}
		};
		Dictionary.countDocuments(queryDict[type], function(err, success) {
			if (success) {
				const totalItem = success;
				const totalPage = Math.ceil(totalItem / pageSize);
				if (currentPage > totalPage) {
					currentPage = totalPage;
				}
				const skipNumber = pageSize * (currentPage - 1);
				Dictionary.find(queryDict[type]).sort({'createTime': -1}).skip(skipNumber).limit(pageSize).exec(function(err, success){
					if(success){
						res.send(200 , {
							code: 0,
							list: success,
							totalPage: totalPage,
							totalItem: totalItem
						});
						return next();
					}else{
						return next(err);
					}
				});
			} else {
				return next(err);
			}
		});
	};

	/**
	 * 添加到本地词典
	 * POST
	 * params: {
	 * 	word: xxx,
	 * 	phonetic: xxx,
	 * 	explains: xxx,
	 * 	removed: false,
	 * }
	 * res: {
	 * 	code: 0
	 * }
	 * errorCode:
	 * 	401:单词已存在。
	 * 添加到词库时会加上createTime字段，用于排序。本地字库查找是否存在该单词，
	 * 如果不存在该单词，添加；如果已存在该单词，不添加。
	 * **/
	this.wordAddToDictionary = function(req , res , next){
		const wordModel = new Dictionary({
			word: req.params.word,
			phonetic: req.params.phonetic,
			explains: req.params.explains,
			removed: false,
			createTime: (new Date()).getTime()
		});
		res.header('Access-Control-Allow-Credentials', true);
		Dictionary.find({"word": req.params.word}, function(err , success){
			if(success){
				if (success.length === 0) {
					wordModel.save(function(err , success){
						if(success){
							res.send(200 , {
								code: 0
							});
							return next();
						}else{
							return next(err);
						}
					});
				} else {
					res.send(200 , {
						code: 4001,
						message: config.errorCode['4001'] // 单词已存在
					});
					return next();
				}
			}else{
				return next(err);
			}
		});
	};

	/**
	 * 添加到生词本
	 * POST
	 * params: {
	 * 	word: xxx
	 * }
	 * res: {
	 * 	code: 0
	 * }
	 * 将本地词典中该单词的removed值设置为false，
	 * 所有添加到生词本的单词，都默认已添加到本地词库。
	 * **/
	this.wordAddToBook = function(req, res, next){
		res.header('Access-Control-Allow-Credentials', true);
		const word = req.params.word;
		const createTime = (new Date()).getTime();
		Dictionary.updateMany({'word': word},{$set: {'removed': false, 'createTime': createTime}}, function(err, success){
			if(success){
				res.send(200 , {
					code: 0,
					message: '已添加'
				});
				return next();
			}else{
				return next(err);
			}
		});
	};

	/**
	 * 从生词本删除
	 * PUT
	 * params: {
	 * 	word: xxx
	 * }
	 * res: {
	 * 	code: 0
	 * }
	 * 将生词本中该单词的removed值设置为false
	 * **/
	this.wordRemove = function(req , res , next) {
		const word = req.params.word;
		res.header('Access-Control-Allow-Credentials', true);
		Dictionary.updateMany({'word': word},{$set:{'removed': true}}, function(err, success) {
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

	/**
	 * 本地词库查找单词
	 * params: {
	 * 	word: xxx
	 * }
	 * res: {
	 * 	code: 0,
	 * 	data: {
	 * 		word: xxx,
	 * 		phonetic: xxx,
	 * 		explains: xxx,
	 * 		removed: xxx,
	 * 		createTime: xxx
	 * 	}
	 * }
	 * **/
	this.wordFind = function(req, res, next) {
		const word = req.params.word;
		res.header('Access-Control-Allow-Credentials', true);
		Dictionary.find({"word": word}, function(err , success){
			if(success){
				if (success[0]) {
					res.send(200 , {
						code: 0,
						data: success[0]
					});
				} else {
					res.send(200 , {
						code: 4002,
						message: config.errorCode['4002']
					});
				}
				return next();
			}else{
				return next(err);
			}
		});
	};

	/**
	 * 从字典中删除
	 * DELETE
	 * params: {
	 * 	word: xxx
	 * }
	 * res: {
	 * 	code: 0
	 * }
	 * 将单词从生词本中彻底删除
	 * **/
	this.wordRemoveFromDictionary = function(req, res, next) {
		const word = req.params.word;
		res.header('Access-Control-Allow-Credentials', true);
		Dictionary.deleteMany({'word': word}, function(err, success) {
			if(success){
				res.send(200 , {
					code: 0,
					message: '已从字典中删除'
				});
				return next();
			}else{
				return next(err);
			}
		});
	}
}
module.exports = new myBookController();