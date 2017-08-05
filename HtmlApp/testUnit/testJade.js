var jade = require("jade");
var fs = require("fs");


// // Compile a function
// var fn = jade.compile('hello world #{name}', {});
//
// // Render the function
// var html = fn({name:'liu'});
// console.log(html);
//
// // 渲染字符串
// var rtn = jade.render('.csser.com hello,#{name}', { name: 'liuchuanchuan' });
// console.log(rtn);

var rtn = jade.renderFile("../templates/jade/testJade", {})
console.log(rtn)

if (fs.existsSync("templates/jade/renderTest.jade")) {
  console.log("jade template was exists!!");
} else {
  console.log("file was not exist!!");
}
