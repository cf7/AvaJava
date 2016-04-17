var Type = require('./type.js');
var IntegerLiteral = require('./integerliteral.js');
var BooleanLiteral = require('./booleanliteral.js');
var VariableReference = require('./variablereference.js');

var BinaryExpression = (function () {

    function BinaryExpression (op, left, right) {
        console.log(op.lexeme);
        this.operator = op;
        this.left = left;
        console.log("CONSTRUCTOR: " + this.left);
        this.right = right;
        this.type = Type.ARBITRARY;
    }
    
    BinaryExpression.prototype.getToken = function() {
        return this.operator;
    };

    BinaryExpression.prototype.toString = function() {
        return `( ${this.operator.lexeme} ${this.left} ${this.right} )`;
    };
    

    BinaryExpression.prototype.analyze = function(context) {
        console.log("inside BinaryExpression analyzer");
        // console.log("LEFT: " + this.left.constructor);
        this.left.analyze(context);
        console.log("LEFT: " + this.left.constructor);

        console.log("BinaryExpression After analyze###########: " + this.left.type);
        this.right.analyze(context);
        var operator = this.operator.lexeme;
        switch (operator) { // add operators to these cases
          case '<':
          case '<=':
          case '>=':
          case '>':
            this.mustHaveIntegerOperands();
            return this.type = Type.BOOL;
          case '==':
          case '!=':
            this.mustHaveCompatibleOperands();
            return this.type = Type.BOOL;
          case 'and':
          case 'or':
            this.mustHaveBooleanOperands();
            return this.type = Type.BOOL;
          case '*':
            var type = this.canHaveDifferentOperands();
            return this.type = type;
          case '+':
            var type = this.canHaveDifferentOperands();
            return this.type = type;
          case '-':
            this.mustHaveCompatibleOperands(); // want to be able to support
            // ints and strings
            return this.type = this.left.type; // or right, either one works
          case '/':
          case '^^':
            this.mustHaveIntegerOperands(); // ints only until implementing floats
            return this.type = Type.INT;
          default: // change defaults
            // this.mustHaveIntegerOperands();
            // return this.type = Type.INT;
        }
    };
    
    BinaryExpression.prototype.mustHaveIntegerOperands = function() {
        var error = this.operator.lexeme + " must have integer operands";
        console.log("inside mustHaveIntegerOperands: " + this.left.type);
        this.left.type.mustBeCompatibleWith(Type.INT, error, this.operator);
        return this.right.type.mustBeCompatibleWith(Type.INT, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveBooleanOperands = function() {
        var error = this.operator.lexeme + " must have boolean operands";
        this.left.type.mustBeCompatibleWith(Type.BOOL, error, this.operator);
        return this.right.type.mustBeCompatibleWith(Type.BOOL, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveCompatibleOperands = function() {
        var error = this.operator.lexeme + " must have mutually compatible operands";
        return this.left.type.mustBeMutuallyCompatibleWith(this.right.type, error, this.operator);
    }

    BinaryExpression.prototype.canHaveDifferentOperands = function() {
        console.log("^^^^^^^^ canHaveDifferentOperands ^^^^^^^^^");
        var error = this.operator.lexeme + " must have either both integers, an integer and a string";
        Type.INT.canBeCompatibleWith(Type.INT, '*');
        Type.INT.canBeCompatibleWith(Type.STRING, '*');
        Type.STRING.canBeCompatibleWith(Type.INT, '*');
        Type.INT.canBeCompatibleWith(Type.INT, '+');
        Type.INT.canBeCompatibleWith(Type.STRING, '+');
        Type.STRING.canBeCompatibleWith(Type.INT, '+');

        Type.STRING.canBeCompatibleWith(Type.STRING, '+');
        console.log(this.left);
        console.log(this.right);
        return this.left.type.isMixedCompatibleWith(this.right.type, this.operator.lexeme, error, this.operator);
    };

    return BinaryExpression;
})();

module.exports = BinaryExpression;