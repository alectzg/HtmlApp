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

function getTimeStr(date) {
  let str = "" + date.getYear();
  str += ("0" + date.getMonth()).replace(/^0+/, "0");
  str += ("0" + date.getDate()).replace(/^0+/, "0");
  str += ("0" + date.getHours()).replace(/^0+/, "0");
  str += ("0" + date.getMinutes()).replace(/^0+/, "0");
  str += ("0" + date.getSeconds()).replace(/^0+/, "0");
  str += ("0" + date.getMilliseconds()).replace(/^0+/, "0");
  return str;
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
    let novelId = req.params["id"];
    //11707013021037013051
    let queryCond = {
      novel_id: novelId
    };

    dbHandler.query("novel_chapters", queryCond, (err, result) => {
      let chapterList = [];
      for (let i = 0, size = result.length; i < size; i++) {
        chapterList.push({})
      }
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
          /*
          res.write($("#content").html());
          // console.log("content: ", $("#content").html())
          // res.write(iconv.decode(iconv.encode("<p>下一页</p>", "GBK").toString(), "GBK")) ----中文乱码
          res.write("<p><a href='novelPre'> pre </a><a href='dir'> dir </a><a href='novelNext'> next </a></p>");
          res.end();
          */
          let ctx = {
            title: $("title").text(),
            novel_title: $("div .bookname h1").text(),
            novel_content: $("#content").html()
          };
          templateRender.render(res, "jade/NovelApp.jade", ctx);
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
    // res.writeHead(200, {
    //   "Content-Type": "text/html"
    // });
    // res.write(novelHandler.nextPage)
    // res.write("<p> next </p>")
    // res.end();
    novelsBusiness.novelHandler.next({}, null)
  },

  pre: function(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write(novelHandler.pre)
    res.write("<p> pre </p>")
    res.end();
  },

  saveDirectory: function(req, res) {
    let dirUrl = req.params["siteLink"];
    let novelName = req.params["name"];
    console.log("prepare fetchArticDir ######\r\n");
    let novelHandler = null;
    if (!novelsBusiness.novelHandler) {
      novelsBusiness.novelHandler = new NovelHandler(novelName);
    }
    novelHandler = novelsBusiness.novelHandler;
    novelHandler.fetchArticDir(dirUrl, {}, (chunk) => {
      let $ = cheerio.load(chunk);
      // console.log("novelTitle: ", $("#info h1").text());
      let links = $("#list dl dd");
      let id = getTimeStr(new Date());
      let dataSet = [];
      for (let i = 0, size = links.length, item = null; i < size; i++) {
        item = $("a", links[i]);
        dataSet.push({
          novel_id: id,
          chapterid: id + "_" + i,
          chapterText: item.text(),
          href: dirUrl + "/" + item.attr("href")
        });
      }
      // console.log("length: ", dataSet.length);
      dbHandler.batchInsert("novel_chapters", dataSet, (err, records) => {
        if (err) {
          console.log("insert fail!");
        } else {
          console.log(`insert records ${records}`)
        }
      });

      return id;
    }).then((retVal) => {
      console.log("retVal ~~~~~~~\r\n");
      templateRender.render(res, "jade/novelIndex.jade", {
        novel_name: novelName,
        novel_id: retVal
      });
    });
  }
}

function testJade(req, res) {
  templateRender.render(res, "jade/novelIndex.jade", {
    novel_name: "我的美女总裁老婆",
    novel_id: "123932"
  });
}

function jadeBootstrap(req, res) {
  /*
  templateRender.render(res, "jade/NovelApp.jade", {
    title: "我的美女总裁老婆",
    novel_title: "第一章 &nbsp; 卖羊肉串的 ",
    novel_content: " 第一章节内容 "
  });
  */
  templateRender.render(res, "jade/NovelApp.jade", {
    title: "我的美女总裁老婆",
    novel_title: "Hello , sell some meat",
    novel_content: "I'm a good man!"
  });
}

function home(req, res) {
  templateRender.render(res, "jade/index.jade", {});
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
  }, {
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
    key: "saveDirectory",
    handler: novelsBusiness.saveDirectory
  }, {
    key: "testJade",
    handler: testJade
  }, {
    key: "jadeBootstrap",
    handler: jadeBootstrap
  }, {
    key: "home",
    handler: home
  }],

  index: "home"
}

module.exports = htmlApp;
