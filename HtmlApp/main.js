// var MongoHandle = require("./dataBaseWare/mongodbHandleWare")
//
// var dbHandler = new MongoHandle("mongodb://localhost:27017/htmlApp");
// 后面这段存在先后顺序问题，待解决


const NovelHandler = require("./app/novelApp");
let cheerio = require("cheerio")
let iconv = require("iconv-lite")
const $Services = require("./framework/Services");
const $getService = require("./framework/common").$getService;

var dbHandler = $Services.getDataBase();
var templateRender = $getService("responseRender");

function sendResponse(res, stateCode, type, content) {
  res.writeHead(stateCode, {
    "Content-Type": type
  });
  res.write(content);
  res.end();
}

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

var novelsBusiness = {
  __init: function() {
    this.novelHandler = new novelHandler("我的美女总裁老婆");
  },
  queryNovelDirs: function(req, res, callback) {
    dbHandler.query("novel", {}, (err, result) => {
      callback(req, res, err, result);
    });
  },

  query: function(req, res) {
    // dbHandler.query("novel")
  },

  saveHotLink: function(req, res) {
    var novelUrl = req.params["url"];
    var novelName = req.params["name"];
    dbHandler.query("novel", {
      name: novelName
    }, (err, result) => {
      if (result.length > 0) {
        let item = {
          url: novelUrl
        };
        dbHandler.update("novel", {
          name: novelName
        }, item, (err, result) => {
          res.writeHead(200, {
            "Content-Type": "text/html"
          });
          res.write("save success!!");
          res.end();
        });
      } else {
        dbHandler.insert("novel", {
          name: novelName,
          url: novelUrl
        }, (err, result) => {
          res.writeHead(200, {
            "Content-Type": "text/html"
          });
          res.write("save success!!");
          res.end();
        });
      }
    });
  },

  show: function(req, res) {
    let novelName = req.params["name"];
    // console.log(dbHandler)
    let queryNovel = new Promise((resolve, reject) => {
      dbHandler.query("novel", {
        name: novelName
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            // console.log(result[0])
            resolve(result[0]);
          } else {
            reject(`sorry! we find nothing about ${novelName}`);
          }
        }
      });
    });
    queryNovel.then((result) => {
      let novelHandler = null;
      if (!novelsBusiness.novelHandler) {
        novelsBusiness.novelHandler = new NovelHandler(novelName);
      }
      novelHandler = novelsBusiness.novelHandler;
      console.log("url: ", result.url)
      novelHandler.updateSite(result.url);
      novelHandler.setRule((res) => {
        var $ = cheerio.load(res);
        let links = $("div.bottem a");
        // console.log("length : ", links.length)
        let item = {};
        for (let i = 0, size = links.length; i < size; i++) {
          item["text"] = $(links[i]).text();
          item["href"] = $(links[i]).attr("href");
          console.log($(links[i]).text(), $(links[i]).attr("href"))
          if ("javascript:;" != item.href) {
            if (item.text == "上一章") {
              novelHandler.prePage = item.href;
              // console.log("prePage: ", item.href)
            } else if (item.text == "章节目录") {
              novelHandler.dir = item.href;
              if ("./" == item.href) {
                novelHandler.dir = novelHandler.siteUrl
              }
              // console.log("directory: ", item.href)
            } else if (item.text == "下一章") {
              novelHandler.nextPage = item.href;
              // console.log("nextPage: ", item.href)
            }
          }
        }
      });
      return new Promise((resolve, reject) => {
        novelHandler.display(result.url, {}, (chunk) => {
          res.writeHead(200, {
            "Content-Type": "text/html"
          });
          const $ = cheerio.load(chunk);
          res.write($("#content").html());
          // console.log("content: ", $("#content").html())
          // res.write(iconv.decode(iconv.encode("<p>下一页</p>", "GBK").toString(), "GBK")) ----中文乱码
          res.write("<p><a href='novelPre'> pre </a><a href='dir'> dir </a><a href='novelNext'> next </a></p>");
          res.end();
        })
      });
    }, (err) => {
      res.writeHead(404, {
        "Content-Type": "text/html"
      });
      res.write("<p> sorry, the resource was not exist!! </p>");
      res.end();
    });
  },

  next: function(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write("<p> next </p>")
    res.end();
  },

  pre: function(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write("<p> pre </p>")
    res.end();
  }
}

function testJade(req, res) {
  templateRender.render(res, "jade/renderTest.jade", {
    name: "Aaron"
  });
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
    },
    {
      key: "saveNovelLink",
      handler: novelsBusiness.saveHotLink
    }, {
      key: "queryNovel",
      handler: novelsBusiness.show
    }, {
      key: "novelNext",
      handler: novelsBusiness.next
    }, {
      key: "novelPre",
      handler: novelsBusiness.pre
    }, {
      key: "testJade",
      handler: testJade
    }
  ],

  index: "index"
}

module.exports = htmlApp;
