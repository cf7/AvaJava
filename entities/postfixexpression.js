"use strict";

var Type = require('./type.js');

class PostfixExpression {

    constructor(op, operand) {
        this.operator = op;
        this.operand = operand;
    }
    
    toString() {
        return '( ' + this.operand + ' ' + this.operator.lexeme + ' )';
    }

    analyze(context) {
        this.operand.analyze(context);
        switch (this.operator.lexeme) {
            case '++':
                this.operand.type.mustBeInteger('The "++" operator requires an integer operand', this.operator)
                this.type = Type.INT;
                break;
            case '--':
                this.operand.type.mustBeInteger('The "--" operator requires an integer operand', this.operator);
                this.type = Type.INT;
                break;
            default:
                break;
        }
        return this;
    }

    optimize() {

    }

}

module.exports = PostfixExpression;