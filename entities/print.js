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
        console.log(this.expression);
        if (this.expression.getToken().kind === "id") {
            console.log("***lookingup***: " + this.expression.getToken().lexeme);
            context.lookupVariable(this.expression.getToken());
        }
    }

    optimize() {
        return "2";
    }
}

module.exports = Print;