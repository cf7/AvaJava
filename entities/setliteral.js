"use strict";
var Type = require('./type.js');

class SetLiteral {
    constructor(values) {
        this.values = values;
    }

    toString() {
        return "{" + this.values.join(',') + "}";
    }

    analyze(context) {
        return this.type = Type.OBJECT;
    }

    optimize() {

    }
}

module.exports = SetLiteral;