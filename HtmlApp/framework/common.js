var functionTools = {
	delegate: function(context, func) {
		let args = Array.prototype.slice.call(arguments).slice(2);
		return function() {
			return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
		}
	}
};


exports.functionTools = functionTools;