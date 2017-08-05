var service = require("./Services")

var functionTools = {
  delegate: function(context, func) {
    let args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
      return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
    }
  }
};

function registerService(serviceName, serviceInstance) {
  service[serviceName] = serviceInstance;
}

function getService(serviceName) {
  return service.getService(serviceName);
}

function isServiceExists(serviceName) {
  return service.isServiceExists(serviceName);
}

function getDataBase(dbName) {
  return service.getDataBase(dbName);
}

// 对外曝露的公共方法
exports.$registerService = registerService;
exports.$getService = getService;
exports.$isServiceExists = isServiceExists;
exports.$getDataBase = getDataBase;

// exports.$Service = {
//   registerService: registerService,
//   getService: getService,
//   isServiceExists: isServiceExists,
//   getDataBase: getDataBase
// };

exports.functionTools = functionTools;
