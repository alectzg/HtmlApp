var http = require("http");
var cheerio = require("cheerio");
var fs = require("fs");
// const escaper = require("true-html-escape");
var iconv = require('iconv-lite')

function saveToHtml(chunk) {
  let chapter1 = fs.createWriteStream("testNovelChapter1.html");
  const $ = cheerio.load(chunk);
  // chapter1.write($("div .bookname h1").text());
  // // console.log("title: ", escaper.unescape($(".bookname").text()));
  console.log("title:", $("title").text())
  console.log("chapter-title: ", $("div .bookname h1").text());
  // chapter1.write("<br>");
  chapter1.write($("#content").html());
  console.log("content: ", encoding.convert($("#content").html(), "utf8", "gbk").toString());

  chapter1.close();
}

function testSnatch(url, option) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
          `Status Code: ${statusCode}`);
      } else if (/^text\/html/.test(contentType)) {

      } else if (!/^application\/json/.test(contentType)) {
        // error = new Error(`Invalid content-type.\n` +
        //   `Expected application/json but received ${contentType}`);
        reject();
      }

      if (error) {
        console.log(error.message);
        // consume response data to free up memory
        res.resume();
        reject();
        return;
      }

      res.setEncoding('binary');
      let rawData = '';
      res.on('data', (chunk) => rawData += iconv.decode(chunk, "gbk"));
      res.on('end', () => {
        try {
          // let parsedData = JSON.parse(rawData);
          // console.log(parsedData);
          // saveToHtml(rawData);
          resolve(rawData);
        } catch (e) {
          console.log(e.message);
          reject();
        }
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
      reject();
    });
  })

}

testSnatch("http://www.cangqionglongqi.com/wodemeinvzongcailaopo/1573963.html", {}).then(saveToHtml, () => {
  console.log("error")
});
