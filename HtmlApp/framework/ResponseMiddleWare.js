// 处理框架响应中间件
var fs = require("fs");
var jade = require("jade");

const merge = (target, ...sources) => Object.assign(target, ...sources);

class ResponseHandler {
  constructor(path = null) {
    if (!!path) {
      this.setTemplatePath(path);
    }
  }

  __generatorOption() {
    return {};
  }

  setTemplatePath(path) {
    this.templatePath = path;
  }

  setErrorPage(errPage) {
    this.resourceEmpty = errPage["Page_404"];
    this.serverErr = errPage["Page_500"];
  }

  render(resp, template, value) {
    //let option = this.__generatorOption();
    let option = {};
    let tmpPath = this.templatePath + "/" + template;
    tmpPath = tmpPath.replace(/\/+/g, "/");
    console.log("jadePath: ", tmpPath)
    if (fs.existsSync(tmpPath)) {
      console.log("file was exist!!");
      resp.writeHead(200, {
        "Content-Type": "text/html"
      });
      // console.log("render template >> begin");
      let rtn = jade.renderFile(tmpPath, merge(option, value))
      // console.log("render finish ====== end");
      resp.write(rtn);
    } else {
      console.log("page was not exist!!")
      let serverErrPage = this.template + "/" + this.serverErr;
      serverErrPage = tmpPath.replace(/\/+/g, "/");
      resp.writeHead("500", {
        "Content-Type": "text/html"
      });
      resp.renderFile(serverErrPage, merge(option, {}));
    }

    resp.end();
    // console.log("response finish~~~");
  }

  sendResponse(resp, stateCode = 200, contentType, content) {
    resp.writeHead(stateCode, {
      "Content-Type": contentType
    });
    resp.write(content);
    resp.end();
  }
}

module.exports = ResponseHandler

__TEST__ = false;

if (__TEST__) {
  var res = {
    writeHead: () => console.log("====================== begin ===================="),

    write: function(value) {
      console.log(value);
    },

    end: () => console.log("====================== end ====================")
  }

  let templateRender = new ResponseHandler("../templates");
  templateRender.render(res, "jade/renderTest.jade", {
    name: "Aaron"
  });

}
