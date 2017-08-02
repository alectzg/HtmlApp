// 配置相关路径，数据库，默认地址，静态文件相关配置
let mainApp = require("./main");

var app = {
	db: {
		dbinstance: "mongodb",
		dbtype: "mongodb",
		url: "mongodb://localhost:27017/htmlApp",
		user: "root",
		password: "admin123",
		dataBase: "mysql",
	},

	static: "static",
	templates: "templates",
	image: "image",
	app: mainApp,
}


exports.app = app