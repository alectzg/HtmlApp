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

function MongoModel(conn_url) {
    this.conn_url = conn_url;
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

    },

    delete: function(colname, query, callback) {
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
};

module.exports = MongoModel