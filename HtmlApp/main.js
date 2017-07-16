
var MongoHandle = require("./dataBaseWare/mongodbHandleWare")

var dbHandler = new MongoHandle("mongodb://localhost:27017/htmlApp");
// 后面这段存在先后顺序问题，待解决
// const $Services = require("./framework/Services");

// console.log($Services)

// var dbHandler = $Services.getDataBase();

var busiHandler = {
	index: function(req, res) {
		res.writeHead(200, {
			"contentType": "text/html"
		});
		res.write("<p> nodejs make something simple!!</p>");
		res.end();
	},
	post: function(req, res) {
		console.log(req["param"]);
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.write("post some parameter !!");
		res.end();
	}
}

var canvasBusiness = {
	saveScript: function(req, res) {
		var scripts = req.params["data"];
		dbHandler.insert("canvas_script", {
			script: scripts
		}, (err, result) => {
			if (err) {
				console.log(err)
			} else {
				console.log(result)
			}
		});
		console.log("paramContent: ", scripts);
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.write("<p> success </p>");
		res.end();
	},
}

var htmlApp = {

	urls: [{
		key: "index",
		handler: busiHandler.index
	}, {
		key: "post",
		handler: busiHandler.post
	}, {
		key: "canval_SaveScript",
		handler: canvasBusiness.saveScript
	}],

	index: "index"
}

module.exports = htmlApp;