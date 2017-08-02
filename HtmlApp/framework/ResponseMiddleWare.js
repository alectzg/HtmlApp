// 处理框架响应中间件
var fs = require("fs")

var responseHandler = {

  Render: function(resp, template, value) {
    if (!!value) {
      // 这里渲染模板转成静态页面
    } else {
      //直接读取静态html，pip到response里面
    }
  },

  sendResponse: function(resp, stateCode = 200, contentType, content) {
    resp.writeHead(stateCode, {
      "Content-Type": contentType
    });
    resp.write(content);
    resp.end();
  }
}
