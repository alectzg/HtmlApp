var http = require("http");
var defApp = require("./defaultConfig");
var $httpHandleWare = require("./middleware");

let httpProcessor = require("./core").busiEmitter;

let customApp = require("../app").app;

// 初始化数据库
(function(appInstance) {
  console.log("init app configuration")
  var services = require("./Services");
  let dbMgr = require("../dataBaseWare/databaseManager").databaseManager;
  let dbInstances = dbMgr.getDatabaseInstance(appInstance);
  // console.log(services)
  services["db"] = dbInstances;
  // services.getDataBase = function() {
  //   // 这里后期请优化
  //   return services["db"]["mongodb"] || {};
  // };
  // console.log(services["db"]["mongodb"].__proto__);
  // console.log("service: ")
  // console.log(services);
})(customApp);

$httpHandleWare.staticFileHandler.init();

// console.log(customApp);

$httpHandleWare.staticFileHandler.setContextPath("static", customApp.static);
$httpHandleWare.staticFileHandler.setContextPath("image", customApp.image);
$httpHandleWare.staticFileHandler.setContextPath("templates", customApp.templates);

// 注册模板服务
((appInstance) => {
  let $registerService = require("./common").$registerService;
	// console.log($registerService);
  let ResponseHandler = require("./ResponseMiddleWare");
  let respHandler = new ResponseHandler(customApp.templates);
  $registerService("responseRender", respHandler);
})(customApp);

// console.log($httpHandleWare.staticFileHandler);

var $Router = require("./dispatcher");

// router依赖于staticFileHandler,这里是否可以解藕
var router = new $Router();
router.init($httpHandleWare.staticFileHandler);

let urls = customApp.app.urls;

router.register(urls);

router.setDefault(customApp.app.index);

// console.log(router);

let optionObj = Object.assign(defApp, customApp);

var httpHandler = $httpHandleWare.httpHandlerWare;

var $httpRequestHandler = $httpHandleWare.httpReqHandler;

// var ctxPath = $httpHandleWare.staticFileHandler.getContext();

// console.log(httpHandler);


let httpServer = http.createServer((req, res) => {
  // 获取url中的路径
  let urlObj = $httpHandleWare.urlHandle.getReqUrlObj(req);
  // 取出请求路径，并消除路径前的"/"
  let urlPath = urlObj["pathname"].replace(/^\/+/, "");
  // 如果需要作会话处理，这里需要做一次会话处理
  if (httpHandler.sessionHandle(req)) {
    let executor = router.match(urlPath);
    $httpRequestHandler.handleRequestParam(req, () => {
      httpProcessor.emit("ParaHandleCompleted", executor, req, res);
    });
    // httpHandler.busiHandle(executor, req, res);
  } else {
    res.write("401", {
      "contentType": "text/html"
    });
    res.write("<p> forbit to visit!! </p>");
    res.end();
  }
}).listen(optionObj.port, () => {
  httpProcessor.register({
    ParaHandleCompleted: function(executor, req, res) {
      return httpHandler.busiHandle(executor, req, res);
    }
  });
  console.log("localhost:" + optionObj.port)
});
