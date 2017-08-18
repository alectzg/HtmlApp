var service = require("./Services")

var functionTools = {
  delegate: function(context, func) {
    let args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
      return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
    }
  },
  
  transIterator: function(obj) {
    let xObj = {};
    // 如果己经是迭代器，则不需要转换
    if (!!obj[Symbol.iterator]) {
      return obj;
    }

    xObj[Symbol.iterator] = function() {
      let index = 0;
      return {
        next: function() {
          return {
            value: obj[index++],
            done: (index >= obj.length)
          };
        }
      };
    }
    return Object.assign(obj, xObj);
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