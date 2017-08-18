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
      let item = Object.assign(result[0], {
        url: novelUrl
      });
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

//saveHotLink({}, new Response());

let __main__ = true

if (__main__) {

  function testInsert(db, iter) {
    let item = iter.next();
    db.insert(item.value, function(err, result) {
      console.log(">>", item.done)
      if (!item.done) {
        setTimeout(() => {
          testInsert(db, iter);
        }, 0);
      } else {
        db.close();
        console.log("batch insert data completed!!");
      }
    });
  }

  var collections = [];

  for (let i = 0; i < 100; i++) {
    collections.push({
      index: i,
      value: "value_" + i
    });
  } // end for

  /*
    collections[Symbol.iterator] = function() {
        let index = 0;
        return {
          next() {
            console.log(">>", index)
            return {
              value: collections[index++],
              done: index >= collections.length
            };
          }
        }
      } // end iterator function



    dbHandler.connect((err, db) => {
      let s = collections[Symbol.iterator]();
      let coll = db.collection("testBatch");
      testInsert(coll,  s);
    })
  */

  dbHandler.batchInsert("testBatch", collections, (err, result) => {
    if (err) {
      console.log("insert fail!");
    } else {
      console.log("batch insert success");
      console.log("insert completed, rowCount = %d.", result);
    }
  })
}