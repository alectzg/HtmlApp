const iconv = require("iconv-lite");
let fs = require("fs");

// fs.createReadStream('testChinese.txt')
//   .pipe(iconv.decodeStream('gbk'))
//   .pipe(iconv.encodeStream('utf8'))
//   .pipe(fs.createWriteStream('file-in-ucs2.txt'));
//
//   fs.createReadStream('testChinese.txt')
//     .pipe(iconv.decodeStream('gbk'))
//     .pipe(iconv.encodeStream('utf8'))
//     .collect(function(err, body){
//       console.log("body: ", body.toString())
//     })

var buffer2=iconv.encode("不是superagent，使用nodejs提供的http模块","GBK");
var str=iconv.decode(new Buffer(buffer2.toString()), "GBK");

console.log(iconv.decode(buffer2, "gbk").toString("utf8"));
