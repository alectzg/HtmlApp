// var MongoHandle = require("./dataBaseWare/mongodbHandleWare")
//
// var mongHandler = new MongoHandle('mongodb://localhost:27017/htmlApp');
const dataBaseManager = require("./dataBaseWare/databaseManager").databaseManager;
let customApp = require("./App").app

var dbinstance = dataBaseManager.getDatabaseInstance(customApp);
let mongHandler = dbinstance["mongodb"]

// mongHandler.insert("site", {
// 	name: "	-旅人~第1章~ ",
// 	collection: " - SMOOTH J",
// 	years: "2014"
// }, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(result);
// 	}
// });
console.log(mongHandler.__proto__)

mongHandler.query("test", null, (err, result) => {
	console.log(result.length)
});

/*
var test = new Promise((resolve, reject) => {
	mongHandler.query("canvas_script", {}, (err, result) => {
		if (err) {
			reject(err);
		} else {
			resolve(result);
		}
	});
});


test.then((result) => {
	result.forEach((item) => {
		console.log(item);
	});
})
// .catch((err) => {
// 	console.log(err);
// })
*/

var test = new Promise((resolve, reject) => {
	mongHandler.query("canvas_script", {}, (err, result) => {
		if (err) {
			reject(err);
		} else {
			resolve(result);
		}
	});
});


test.then((ItemSet) => {
	return new Promise((resolve, reject) => {
		ItemSet.forEach(function(item) {
			resolve(item)
		});
	});
}).then((item) => {
	console.log(item)
});

// mongodb.update()
