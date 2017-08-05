var cheerio = require("cheerio")

var templateRender = {
  renderNovel: function(doc, dataCtx, callback) {
    var $ = cheerio.load("<body><div class='content'></div></body>");
    var $$ = cheerio.load("<div id='template'>" + dataCtx + "</div>");
    // console.log("inputData: ", dataCtx);
    // $$("p").each((i, item) => {
    //   $("div.content").append("<p>" + $$(this).text() + "</p>");
    //   console.log("<p>" + $$(this).text() + "</p>")
    // })
    console.log($$("#template").children().length)
    $("div.content").append("<div class='pageinfo'>下一页</div>")
    console.log($.html());
  }
}


exports.templateRender = templateRender;
