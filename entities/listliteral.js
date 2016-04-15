"use strict";
class ListLiteral {
    constructor(elements) {
        this.elements = elements;
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