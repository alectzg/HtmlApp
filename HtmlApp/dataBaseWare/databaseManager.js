// 用于解析app中定义的数据库，并初始化数据库服务
let util = require("util");
const $MongoDB = require("./mongodbHandleWare");

var databaseManager = {
  dbWare: {
    mongodb: $MongoDB
  },

  getDatabaseInstance: function(app) {
    var retDBs = {};
    var databaseCfgs = null;
    let item = null;

    // 如果没有配置db，则不进行初始化实例
    if (!app.db) {
      return null;
    }

    if (!util.isArray(app.db)) {
      databaseCfgs = [app.db];
    } else {
      databaseCfgs = app.db;
    }

    for (let i = 0, size = databaseCfgs.length; i < size; i++) {
      item = databaseCfgs[i];
      if (!item["dbtype"]) {
        throw new Error("unkown database type, config dbtype pls!!");
        continue;
      }

      let $cls = this.dbWare[item["dbtype"]];
      if ("string" == typeof($cls)) {
        if ("mongodb" == $cls) {
          $cls = $MongoDB;
        }
      }
      let instanceName = item["dbinstance"];
      retDBs[instanceName] = new $cls(item["url"]);
      console.log(item["url"])
    }

    return retDBs;
  }
}

exports.databaseManager = databaseManager;
