var fs = require("fs")
var utils = require("util");

var buffer = new Buffer("");

// let readStream = fs.createReadStream("favicon.ico");

let i = 0;

// readStream.on("data", function(chunk) {
// 	chunk.copy(buffer, i, 0, chunk.length);
// 	i = i + chunk.length;
// });

// readStream.on("end", function() {
// 	console.log("=============== base64 ===================\r\n");
// 	console.log(buffer.toString("base64"));
// 	console.log("=============== end ====================\r\n");
// });

// fs.readFile("test.jpg", function(err, chunk){
// 	console.log("=============== base64 ===================\r\n");
// 	console.log("data:image/png;base64,",chunk.toString("base64"));
// 	console.log("=============== end ====================\r\n");
// })


var EventEmitter = require("events").EventEmitter;

function TestEmitter() {

}

utils.inherits(TestEmitter, EventEmitter);

var xobj = new TestEmitter();

xobj.on("data", function() {
	let args = Array.prototype.slice.call(arguments);
	for (let i = 0, size = args.length; i < size; i++) {
		console.log(i, " => ", args[i]);
	}
	
	var innerFunc = function(errcode, data) {
		console.log(errcode);
		console.log(data);
	};

	// innerFunc.apply(null, args);

	innerFunc(args);
});

xobj.emit("data", "ERR IS NULL", "hello world");


function testArguments() {
	let args = Array.prototype.slice.call(arguments);
	for (let i = 0, size = args.length; i < size; i++) {
		console.log(args[i]);
	}
}

// (()=>{
// 	let args = Array.prototype.slice.call(arguments);
// 	for (let i = 0, size = args.length; i < size; i++) {
// 		console.log(args[i]);
// 	}
// })("test", "hello", "sdkfd")