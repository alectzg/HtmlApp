var httpClient = require("http")
var cheerio = require("cheerio");
var iconv = require('iconv-lite')

var snatchor = {
  // 抓取html
  snatchHtmlByUrl: function(url, option) {
    return new Promise((resolve, reject) => {
      httpClient.get(url, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
            `Status Code: ${statusCode}`);
        } else if (!/^text\/html/.test(contentType)) {
          error = new Error(`Invalid content-type.\n` +
            `Expected application/json but received ${contentType}`);
        }

        if (error) {
          console.log(error.message);
          // consume response data to free up memory
          res.resume();
          reject(error);
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
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
        err = new Error(`Invalid Http Request.\n` +
          `${e.message}`);
        reject(err);
      });
    });
  },
  // 抓取图像
  snatchImgByUrl: function(url, option, callback) {
    httpClient.get(url, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error = null;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
          `Status Code: ${statusCode}`);
      } else if (!/^text\/html/.test(contentType)) {
        error = new Error(`Invalid content-type.\n` +
          `Expected application/json but received ${contentType}`);
      }

      if (error) {
        console.log(error.message);
        // consume response data to free up memory
        res.resume();
      } else {
        res.setEncoding('binary');
      }
      callback(err, res)
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
      err = new Error(`Invalid Http Request.\n` +
        `${e.message}`);
      reject(err);
    });
  }
};

exports.snatcher = snatchor;
