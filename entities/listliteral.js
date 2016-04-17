"use strict";

var Type = require('./type.js');

class ListLiteral {
    constructor(elements) {
        this.elements = elements;
        this.type = Type.ITERABLE;
    }

    toString() {
        return "[" + this.elements.join(',') + "]";
    }

    analyze(context) {
        // typechecking
    }

    optimize() {

    }
}

module.exports = ListLiteral;