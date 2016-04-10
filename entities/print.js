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
        // for (var i = 0; i < this.expression.length; i++) {
        //     if (this.expression[i].getToken().kind === "id") {
        //         console.log("***lookingup***: " + this.expression[i].getToken().lexeme);
        //         context.lookupVariable(this.expression[i].getToken());
        //     }
        // }
        return this.expression.analyze(context);
    }

    optimize() {
        return "2";
    }
}

module.exports = Print;