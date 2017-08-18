const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/htmlApp';
// # 数据库为 htmlApp

// var insertData = function(db, callback) {
//     //连接到表 site
//     var collection = db.collection('site');
//     //插入数据
//     var data = [{
//         "name": "菜鸟教程",
//         "url": "www.runoob.com"
//     }, {
//         "name": "菜鸟工具",
//         "url": "c.runoob.com"
//     }];
//     collection.insert(data, function(err, result) {
//         if (err) {
//             console.log('Error:' + err);
//             return;
//         }
//         callback(result);
//     });
// }

// MongoClient.connect(DB_CONN_STR, function(err, db) {
//     console.log("连接成功！");
//     insertData(db, function(result) {
//         console.log(result);
//         db.close();
//     });
// });
/*
class MongoModel {
    constructor(conn_url) {
        this.conn_url = conn_url;
    }

    connect(callback) {
        MongoClient.connect(this.conn_url, function() {
            callback();
            db.close();
        });
    }


    insert(colname, document, callback) {
        MongoClient.connect(this.conn_url, (err, db) => {
            if (err) {
                console.log("connect database fail!!\r\n");
            } else {
                let collection = db.collection(colname);
                collection.insert(document, function(err, result) {
                    if (err) {
                        console.log("Err: ", err);
                    }
                    callback(err, result);
                    db.close();
                });
            }
        });
    }

    update(colname, query, updateVal, callback) {
        MongoClient.connect(this.conn_url, (err, db) => {
            if (err) {
                console.log("connect database fail!!\r\n");
            } else {
                let collection = db.collection(colname);
                collection.update(query, {
                    $set: updateVal
                }, function(err, result) {
                    if (err) {
                        console.log("Err: ", err);
                    }
                    callback(err, result);
                    db.close();
                });
            }
        });
    }

    query(colname, query, callback) {
        MongoClient.connect(this.conn_url, (err, db) => {
            if (err) {
                console.log("connect database fail!!\r\n");
            } else {
                query = query || {};
                let collection = db.collection(colname);
                let queryResult = collection.find(query, (err, result) => {
                    if (err) {
                        console.log("Err: ", err);
                    } else {
                        callback(err, result);
                    }
                });

                db.close();
            }
        });

    }

    delete(colname, query, callback) {
        MongoClient.connect(this.conn_url, (err, db) => {
            if (err) {
                console.log("connect database fail!!\r\n");
            } else {
                query = query || {};
                let collection = db.collection(colname);
                let queryResult = collection.remove(query, (err, data) => {
                    if (err) {
                        console.log("Err: ", err);
                    } else {
                        callback(err, data);
                    }
                });

                db.close();
            }
        });
    }
}
*/
let __DEFINE_CLASS__ = true
if (__DEFINE_CLASS__) {
  class MongoModel {
    constructor(conn_url) {
      this.conn_url = conn_url;
      // console.log("constructor >> conn_url", conn_url);
    }

    connect(callback) {
      console.log("[ConnectURL]", this.conn_url);
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          callback(err, null);
          console.log("connect database fail!!\r\n")
        } else {
          callback(null, db);
          db.close();
        }
      });
    }

    insert(colname, document, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
        } else {
          let collection = db.collection(colname);
          collection.insert(document, function(err, result) {
            if (err) {
              console.log("Err: ", err);
            }
            callback(err, result);
            db.close();
          });
        }
      });
    }

    update(colname, query, updateVal, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
        } else {
          let collection = db.collection(colname);
          collection.update(query, {
            $set: updateVal
          }, function(err, result) {
            if (err) {
              console.log("Err: ", err);
            }
            callback(err, result);
            db.close();
          });
        }
      });
    }

    query(colname, query, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
          callback(err, null);
        } else {
          query = query || {};
          let collection = db.collection(colname);
          let queryResult = collection.find(query).toArray((err, result) => {
            if (err) {
              console.log("Err: ", err);
              callback(err, null);
            } else {
              callback(err, result);
            }
          });

          db.close();
        }
      });
    }

    delete(colname, query, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
          callback(err, null);
        } else {
          query = query || {};
          let collection = db.collection(colname);
          let queryResult = collection.remove(query, (err, data) => {
            if (err) {
              console.log("Err: ", err);
              callback(err, null);
            } else {
              callback(err, data);
            }
          });
          db.close();
        }
      });
    }

    batchInsert(colname, dataSet, callback) {
      // 迭代器封装函数
      function __externIterator(arraySet) {
        if (!!arraySet[Symbol.iterator]) {
          console.log("object was iterator!")
          return arraySet;
        } else {
          let xObj = {};
          xObj[Symbol.iterator] = function() {
            let index = 0;
            return {
              next() {
                return {
                  value: obj[index++],
                  done: (index > obj.length)
                };
              }
            };
          }
          return Object.assign(obj, xObj);
        }
      }

      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
          callback(err, null);
        } else {
          let collection = db.collection(colname);
          // 将数据集转换成迭代器
          let _dataSet = __externIterator(dataSet);
          let _recordCount = 0;

          // 单行插入成功后，迭代进行下一行插入
          function __insertRow(coll, iterator) {
            let item = iterator.next();
            // 批量插入完成后，需关闭数据库连接
            if (item.done) {
              db.close();
              callback(null, _recordCount);
              return;
            }
            _recordCount++;
            coll.insert(item.value, (err, result) => {
              if (err) {
                console.log("insert data fail!");
                db.close();
                callback(err, null);
              } else {
                // console.log(">>", item.done);
                // console.log(item.value)
                // 集合己遍历完成，则关闭连接
                if (item.done) {
                  db.close();
                  callback(null, "insert success~~");
                } else {
                  // 为防止回调导致内存暴仓，这里用一个setTimeout
                  setTimeout(() => __insertRow(coll, iterator), 0);
                }
              }
            })
          }
          let _s = _dataSet[Symbol.iterator]();
          // console.log(s);
          __insertRow(collection, _s);
        }
      });
    }
  }

  // console.log("class >> ");
  // console.log(MongoModel)
  module.exports = MongoModel

} else {
  function MongoModel(conn_url) {
    this.conn_url = conn_url;
    // console.log("constructor >> conn_url", conn_url);
  };

  MongoModel.prototype = {
    connect: function(callback) {
      MongoClient.connect(this.conn_url, function() {
        callback();
        db.close();
      });
    },


    insert: function(colname, document, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
        } else {
          let collection = db.collection(colname);
          collection.insert(document, function(err, result) {
            if (err) {
              console.log("Err: ", err);
            }
            callback(err, result);
            db.close();
          });
        }
      });
    },

    update: function(colname, query, updateVal, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
        } else {
          let collection = db.collection(colname);
          collection.update(query, {
            $set: updateVal
          }, function(err, result) {
            if (err) {
              console.log("Err: ", err);
            }
            callback(err, result);
            db.close();
          });
        }
      });
    },

    query: function(colname, query, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
          callback(err, null);
        } else {
          query = query || {};
          let collection = db.collection(colname);
          let queryResult = collection.find(query).toArray((err, result) => {
            if (err) {
              console.log("Err: ", err);
              callback(err, null);
            } else {
              callback(err, result);
            }
          });

          db.close();
        }
      });

    },

    delete: function(colname, query, callback) {
      MongoClient.connect(this.conn_url, (err, db) => {
        if (err) {
          console.log("connect database fail!!\r\n");
          callback(err, null);
        } else {
          query = query || {};
          let collection = db.collection(colname);
          let queryResult = collection.remove(query, (err, data) => {
            if (err) {
              console.log("Err: ", err);
              callback(err, null);
            } else {
              callback(err, data);
            }
          });

          db.close();
        }
      });
    }
  };
  console.log(MongoModel)
  module.exports = MongoModel
}
