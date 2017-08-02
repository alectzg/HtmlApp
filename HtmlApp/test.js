var http = require("http");

var redirect = function(req, res) {
  res.writeHead(302, {
    "Content-Type": "text/html",
    "Location": "https://www.baidu.com"
  });
  res.end();
}

var handlePost = function(req, res) {
  console.log("method: ", req.method)
  req.on("data", function(chunk) {
    console.log("get data");
    console.log(chunk.toString());
  }).on("end", function(chunk) {
    // console.log("===================================");
  });
  res.end();
}

http.createServer((req, res) => {
  // console.log(req);
  handlePost(req, res);

}).listen(5000);
