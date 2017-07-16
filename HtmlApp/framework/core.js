var EventEmitter = require("events").EventEmitter;
var util = require("util");
var functionTools = require("./common").functionTools;

function BusiEmitter() {
	this.events = ["ParaHandleCompleted", "BeforeHandle", "error"];
	this.eventHandler = [];
}

BusiEmitter.prototype.register = function(eventHandler) {
	let evtName = "";

	for (let i = 0, size = this.events.length; i < size; i++) {
		evtName = this.events[i];
		if (!!eventHandler[evtName]) {

			if (!this.eventHandler[evtName]) {
				this.eventHandler[evtName] = [];
			}

			this.eventHandler[evtName].push(eventHandler[evtName]);
		}
	}
}

BusiEmitter.prototype.registerBusiExec = function(busiExec) {
	let evtName = "ParaHandleCompleted";

	if (!this.eventHandler[evtName]) {
		this.eventHandler[evtName] = [];
	}

	this.eventHandler[evtName].push(eventHandler[evtName]);
}

util.inherits(BusiEmitter, EventEmitter);

var busiEmitter = new BusiEmitter();

busiEmitter.on("ParaHandleCompleted",
	functionTools.delegate(busiEmitter, function() {
		let executor = null;
		let eventHandler = null;
		if (!!this.eventHandler["ParaHandleCompleted"]) {
			eventHandler = this.eventHandler["ParaHandleCompleted"];
			let args = Array.prototype.slice.call(arguments);
			for (let i = 0, size = eventHandler.length; i < size; i++) {
				executor = eventHandler[i];
				executor.apply(null, args);
			}
		} else {
			console.log("do nothing!!");
		}
	})
);

busiEmitter.on("BeforeHandle", (req, res) =>{

});

busiEmitter.on("error", (req, res) =>{

});

exports.busiEmitter = busiEmitter;