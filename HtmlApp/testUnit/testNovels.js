var MongoHandle = require("../dataBaseWare/mongodbHandleWare")

var dbHandler = new MongoHandle('mongodb://localhost:27017/htmlApp');

function Response() {

}

Response.prototype = {
  writeHead: function() {
    console.log("=========== response begin ==============");
  },
  write: function(val) {
    console.log(val)
  },
  end: function() {
    console.log("=========== end ===========")
  }
}

var saveHotLink = function(req, res) {
  var novelUrl = "http://www.yahoo.com"
  var novelName = "xiaoshuo"
  dbHandler.query("novel", {
    name: novelName
  }, (err, result) => {
    console.log("result length: ", result.length)
    if (result.length > 0) {
      let item = Object.assign( result[0], {url: novelUrl});
      dbHandler.update("novel", {
        name: novelName
      }, item, (err, result) => {
        res.writeHead(200, {
          "Content-Type": "text/html"
        });

        if (err) {
          console.log(err);
          res.write(err);
        } else {
          res.write("save success!!");
        }

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
}

saveHotLink({}, new Response());
