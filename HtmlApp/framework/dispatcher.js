// 处理http路由

function Router() {
	// this.isHtmlRequest = null;
};

Router.prototype = {

	init: function(staticFileHandler) {
		this.routeMap = [];
		this.isStaticRequest = staticFileHandler.isStaticRequest;
		this.RequestHandler = staticFileHandler;
		// this.errorPageHandler = staticFileHandler.errorPageHandler;
		this.registerOne("favicon.ico", staticFileHandler.dealEmpty)
		this.defaultItem = "";
	},

	registerOne: function(key, handler, isForce) {
		isForce = isForce || false;
		// 是否强制替换
		if (!isForce && !!this.routeMap[key])
			return;
		this.routeMap[key] = handler;
	},
	// 注册路由处理
	register: function(urlArray) {
		let item = null;
		for (let i = 0, size = urlArray.length; i < size; i++) {
			item = urlArray[i];
			this.routeMap[item["key"]] = item["handler"];
		}
	},
	// 寻找路由
	match: function(path) {
		let retHandler = null;
		console.log(path);

		if (path.replace(/^\s+|\s+$/, "").length == 0) {
			path = this.defaultItem;
		}
		// 处理静态文件如css, js, html等请求
		if (this.isStaticRequest(path)) {
			// console.log("is static file request!! \r\n");
			return this.RequestHandler.staticFileRequestHandler;
		}

		retHandler = this.__find(path);
		if (!retHandler) {
			// console.log("sorry, could't find some urlhandle for '" + path + "'");
			return this.RequestHandler.errorPageHandler;
		} else {
			// console.log("match a url handler#########!\r\n");
			return retHandler;
		}
	},
	// 匹配注册的路径
	__find: function(path) {
		return this.routeMap[path];
	},

	setDefault: function(url) {
		this.defaultItem = url;
	}
}


module.exports = Router;