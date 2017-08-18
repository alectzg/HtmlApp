const crawler = require("./snatch").snatcher;
var cheerio = require("cheerio");
const url = require("url");

function NovelHandler(name) {
  this.__init(name);
}

NovelHandler.prototype = {
  __init: function(novelName) {
    this.name = novelName;
  },
  // 保存用于翻页的url信息
  storePageInfo: function(prePage, nextPage, dir) {
    this.prePage = prePage;
    this.nextPage = nextPage;
    this.dir = dir;
  },
  // 切换网页源地址
  updateSite: function(newSite) {
    this.oldSite = this.site;
    this.site = newSite;
    this.fetchSiteDir(newSite);
  },
  // 解析翻页信息规则
  setRule: function(ruleItem) {
    this.rule = ruleItem;
  },

  display: function(url, option, callback) {
    var __this = this;
    return crawler.snatchHtmlByUrl(url, option).then((res) => {

      if (!!__this.rule) {
        __this.rule(res);
      }

      return new Promise((resolve, reject) => {
        resolve(res);
      });
    }).then(callback)
  },

  next: function(option, callback) {
    let rule = this.rule;
    let url = this.nextPage;
    console.log(this.siteUrl)
    url = this.siteUrl + "/" + this.nextPage;
    url = url.replace(/\/+/g, "/");
    console.log("url: " + url);
    this.display(url, option, rule, callback);
  },

  forward: function(option, callback) {
    let rule = this.rule;
    let url = this.prePage;
    this.display(url, option, rule, callback);
  },

  showDir: function(option, callback) {
    this.display(url, option, callback);
  },

  showPageInfo: function() {
    console.log("prePage: ", this.prePage);
    console.log("nextPage: ", this.nextPage);
    console.log("dir: ", this.dir);
  },

  fetchSiteDir: function(urlLink) {
    let urlObj = url.parse(urlLink);
    if (!!urlObj.query) {
      this.siteUrl = urlLink;
    } else {
      this.siteUrl = urlObj.href.replace(/^(.*)\/.*?$/, "$1") + "/";
    }
  },

  fetchArticDir: function(url, option, callback) {
    return crawler.snatchHtmlByUrl(url, option).then((chunk) => {
      return new Promise((resolve, reject) => {
        let retVal = callback(chunk);
        resolve(retVal);
      });
    });
  }
  // end fetchArticDir
}

module.exports = NovelHandler

let __main__ = "debug"
if (__main__ == "display") {
  let novelRender = require("./AppTemplate").templateRender;
  let novelhandler = new NovelHandler("我的美女总裁老婆");

  novelhandler = new Proxy(novelhandler, {
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  });

  let siteUrl = "http://www.cangqionglongqi.com/wodemeinvzongcailaopo/1573963.html";

  novelhandler.setRule((res) => {
    var $ = cheerio.load(res);
    let links = $("div.bottem a");
    // console.log("length : ", links.length)
    let item = {};
    for (let i = 0, size = links.length; i < size; i++) {
      item["text"] = $(links[i]).text();
      item["href"] = $(links[i]).attr("href");
      console.log($(links[i]).html(), $(links[i]).attr("href"))
      if ("javascript:;" != item.href) {
        if (item.text == "上一章") {
          novelhandler.prePage = item.href;
          // console.log("prePage: ", item.href)
        } else if (item.text == "章节目录") {
          novelhandler.dir = item.href;
          if ("./" == item.href) {
            novelhandler.dir = novelhandler.siteUrl
          }
          // console.log("directory: ", item.href)
        } else if (item.text == "下一章") {
          novelhandler.nextPage = item.href;
          // console.log("nextPage: ", item.href)
        }
      }
    }
  });

  // novelhandler.next({}, (chunk) => {
  //   let chapter1 = fs.createWriteStream("testNovelChapter1.html");
  //   const $ = cheerio.load(chunk);
  //   // chapter1.write($("div .bookname h1").text());
  //   // // console.log("title: ", escaper.unescape($(".bookname").text()));
  //   //  console.log("title: ", $("div .bookname h1").text());
  //   // chapter1.write("<br>");
  //   chapter1.write($("#content").html());
  //   console.log("content: ", $("#content").html())
  //
  //   chapter1.close();
  // });


  novelhandler.display(siteUrl, {}, (chunk) => {
    let fs = require("fs");
    let chapter1 = fs.createWriteStream("testNovelChapter1.html");
    const $ = cheerio.load(chunk);
    // chapter1.write($("div .bookname h1").text());
    // // console.log("title: ", escaper.unescape($(".bookname").text()));
    //  console.log("title: ", $("div .bookname h1").text());
    // chapter1.write("<br>");
    chapter1.write($("#content").html().toString("utf8"));
    // console.log("content: ", $("#content").html())

    chapter1.close();

    novelRender.renderNovel("", $("#content").html(), null);
  }).then(() => novelhandler.showPageInfo());
} else if (__main__ == "dir") {
  const fs = require("fs")
  let novelHandler = new NovelHandler("我的美女总裁老婆");
  let siteUrl = "http://www.cangqionglongqi.com/wodemeinvzongcailaopo/";
  novelHandler.fetchArticDir(siteUrl, {}, (res) => {
    const $ = cheerio.load(res);
    console.log("novelTitle: ", $("#info h1").text());
    // console.log($("#list dl").html());
    let dirChatper = fs.createWriteStream("testDir.html");

    dirChatper.write($("#list dl").html());
    dirChatper.close();
    // console.log("length: ", $("#list dl dd").length)
    let ddLinks = $("#list dl dd");
    for (let i = 0, size = ddLinks.length; i < size; i++) {
      console.log("title: ", $("a", ddLinks[i]).text(), " ", $("a", ddLinks[i]).attr("href"))
    }
  }).then(() => console.log("completed~~~~"));
}
