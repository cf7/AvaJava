"use strict";
class Print {

    constructor(expression) {
        this.expression = expression;
    }

    toString() {
        return "( " + "ava " + this.expression + " )";
    }

    analyze(context) {
        console.log("=====inside print analyze=====");
        return this.expression.analyze(context);
    }

    optimize() {
        return "2";
    }
}

module.exports = Print;