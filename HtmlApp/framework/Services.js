// 用于注册公共服务
var service = {
  db: {},
  getDataBase: function(dbName = "mongodb") {
    return this.db[dbName] || new Proxy({}, {
      get: function(target, name) {
        if (!target[name]) {
          let lazyObj = null;
          console.log("trigger reload >> ", name)
          lazyObj = service["db"][dbName];
          // console.log(service.db)
          // console.log("dbname: ", dbName)
          console.log(lazyObj);
          // target = Object.assign(target, lazyObj);
          target[name] = lazyObj[name];
          //target.__proto__ = Object.assign(target.__proto__, lazyObj.__proto__);
        }
        return target[name];
      }
    });
  },

  getService(serviceName) {
    return this[serviceName] || new Proxy({}, {
      get: function(target, name) {
        if (!target[name]) {
          let lazyObj = null;
          //  console.log("trigger reload >> ", name)
          lazyObj = service[serviceName];
          // console.log(lazyObj[name])
          target[name] = lazyObj[name];
        }
        return target[name];
      }
    });
  },

  isServiceExists(serviceName) {
    if (!!this[serviceName]) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = service;
