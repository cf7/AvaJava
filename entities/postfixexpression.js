"use strict";

class PostfixExpression {

    constructor(op, operand) {
        this.operator = op;
        this.operand = operand;
    }
    
    toString() {
        return '( ' + this.operand + ' ' + this.operator.lexeme + ' )';
    }

    analyze(context) {
        // typechecking
        return this.operand.analyze(context);
    }

}

module.exports = PostfixExpression;