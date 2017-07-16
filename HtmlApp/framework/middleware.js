let util = require("util");
let url = require("url");
let fs = require("fs");
let querystring = require("querystring");

const imgRegExp = /\.jpg|\.png|\.svg|\.gif|\.bmp|\.ico$/
const htmlRegExp = /\.html$/
const textFileRegExp = /\.js|\.css|\.inc$/

var urlHandle = {
	getReqUrlObj: function(req) {
		let urlObj = url.parse(req.url);
		return urlObj;
	},
};

var staticFileHandler = {
	__contextPath: [],
	__rootDir: "",
	contentType: {
		"html": "text/html",
		"png": "image/png",
		"jpg": "image/jpg",
		"bmp": "image/bmp",
		"gif": "image/gif",
		"ico": "image/x-icon",
		"css": "text/css",
		"js": "text/javascript"
	},

	init: function() {
		this.__rootDir = fs.realpathSync("..");
		// console.log("rootDir: " + this.__rootDir);
	},

	setContextPath: function(ctxName, ctxVal) {
		ctxVal = ctxVal || "";
		this.__contextPath[ctxName] = ctxVal;
	},

	getContextPath: function(ctxName) {
		return this.__contextPath[ctxName];
	},

	getRoot: function() {
		return this.__rootDir;
	},

	getContentType: function(path) {
		let fileType = path.replace(/.*?\.(\w+)$/, "$1");
		return this.contentType[fileType] || ("text/" + fileType);
	},

	isStaticRequest: function(path) {
		if (/\.html|\.js|\.css|\.inc$/.test(path)) {
			return true;
		} else if (imgRegExp.test(path)) {
			return true;
		} else {
			return false;
		}
	},

	// 如果是网络资源，怎么取？
	staticFileRequestHandler: function(req, res) {
		let urlObj = urlHandle.getReqUrlObj(req);
		let filePath = urlObj["pathname"];
		let baseName = "";
		let key = "";

		// console.log("urlPath : " + filePath);
		// html从templates中取
		if (htmlRegExp.test(filePath)) {
			// baseName = staticFileHandler.__contextPath["templates"];
			key = "templates";
		} else if (textFileRegExp.test(filePath)) {
			// baseName = this.__contextPath["static"];
			key = "static";
		} else if (imgRegExp.test(filePath)) {
			// baseName = this.__contextPath["image"];
			key = "image";
		}
		// console.log("key >> ${key}", key);

		baseName = staticFileHandler.getContextPath(key);

		// console.log(`baseName >> ${baseName}`);

		let fileRealPath = baseName + "/" + filePath;
		fileRealPath = fileRealPath.replace(/\/+/g, "/");
		// console.log("not rootdir fileRealpath: " + fileRealPath);

		fileRealPath = staticFileHandler.getRoot() + "/" + fileRealPath;
		// console.log("fileRealpath: " + fileRealPath);

		if (fs.existsSync(fileRealPath)) {
			let contentType = staticFileHandler.getContentType(filePath);
			let fileReadStream = fs.createReadStream(fileRealPath);
			res.writeHead(200, {
				"content-Type": contentType
			});
			fileReadStream.pipe(res);
			fileReadStream.on("end", () => {
				res.end()
			});
		} else {
			res.writeHead(404, {
				"content-Type": "text/html"
			});
			res.end();
		}
	},

	errorPageHandler: function(req, res) {
		res.writeHead(500, {
			"contentType": "text/html"
		});
		res.write("<p> server error!! </p>");
		res.end();
	},

	dealEmpty: function(req, res) {
		res.writeHead(200);
		res.end();
	}
};

var httpReqHandleWare = {
	// 解析http请求中的参数
	handleRequestParam: function(req, callback) {
		var param = {};
		// get可直接取参数
		if ("GET" == req.method) {
			let urlObj = url.parse(req.url);
			let queryObj = querystring.parse(urlObj.query);
			param = Object.assign({}, queryObj);
			req["params"] = param;
			if (!!callback) {
				callback.call();
			}
		} else if ("POST" == req.method) {
			// post存在回调导致的异步时序问题
			let buffer = Buffer.alloc(2048, 0, "utf8");
			let start = 0;
			req.on("data", function(chunk) {
				console.log("data", chunk.toString());
				chunk.copy(buffer, start, 0, chunk.length);
				start = start + chunk.length;
				// console.log(">> data", buffer.toString());
			});

			req.on("end", () => {
				console.log("start: ", start);
				let content = buffer.toString("utf8", 0, start).replace(/^\s+|\s+$/g, "");
				console.log("postParams", content);
				let queryObj = querystring.parse(content);
				param = Object.assign({}, queryObj);
				req["params"] = param;
				if (!!callback) {
					callback.call();
				}
			});

		} else if ("PUT" == req.method || "DELETE" == req.method) {

		}
	}
};

var httpHandlerWare = {
	// 会话拦截管理
	sessionHandle: function(req, res) {
		return true;
	},

	// 业务处理
	busiHandle: function(executor, req, res) {
		try {
			return executor(req, res)
		} catch (err) {
			return this.exceptionHandler(errcode, req, res);
		}
	},

	// after handle
	afterHandle: function(req, res) {

	},

	exceptionHandler: function(errcode, req, res) {

	},


}


var httpRespHandler = {
	redirect: function(req, res, url, option) {
		res.writeHead(302, {
			"Content-Type": "text/html",
		});
		res.setHeader("Location", url);
		res.end();
	},

	render: function(res, template, rendData) {

	}
}

exports.staticFileHandler = staticFileHandler;
exports.urlHandle = urlHandle;
exports.httpHandlerWare = httpHandlerWare;
exports.httpRespHandler = httpRespHandler;
exports.httpReqHandler = httpReqHandleWare;