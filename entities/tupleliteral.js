"use strict";

var Type = require('./type.js');

class TupleLiteral {
	constructor(elements){
		this.elements = elements;
		this.type = Type.TUPLE;
	}

	toString() {
		return "";
	}

	analyze(context) {

	}

	optimize() {

	}
}

module.exports = TupleLiteral;