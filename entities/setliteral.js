"use strict";
var Type = require('./type.js');

class SetLiteral {
    constructor(values) {
        this.values = values; // array of values
    }

    toString() {
        return "{" + this.values.join(',') + "}";
    }

    analyze(context) {
        return this.type = Type.OBJECT; // for now they are objects
    }

    optimize() {

    }
}

module.exports = SetLiteral;