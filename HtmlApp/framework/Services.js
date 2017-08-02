// 留给框加注测服务用
var service = {
  dbInstance: {},
  getDataBase: function(dbName = "monogodb") {
    return this.dbInstance[dbName] || null;
  }
};

function registerService(serviceName, serviceInstance) {
  service[serviceName] = serviceInstance;
}

module.exports = service;

exports.$registerService = registerService;
