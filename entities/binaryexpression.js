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


    BinaryExpression.prototype.optimize = function() {
        console.log("inside BinaryExpression optimize");
        console.log("OPERATOR");
        console.log(this.operator);
        console.log("LEFT");
        console.log(this.left);
        console.log("RIGHT");
        console.log(this.right);
        this.left = this.left.optimize();
        this.right = this.right.optimize();
        if (this.left instanceof IntegerLiteral && this.right instanceof IntegerLiteral) {
          console.log("=-=-=-=-=-=-=-=- about to fold integer constants -=-=-=-=-=-=-=-=");
          console.log(this.left);
          console.log(this.right);
          // the unary '+this.left.value' operator is converting the value to a number
          // just in case the value is a string or char
          return this.foldIntegerConstants(this.operator.lexeme, +this.left.value, +this.right.value);
        } else if (this.left instanceof BooleanLiteral && this.right instanceof BooleanLiteral) {
          console.log("=-=-=-=-=-=-=-=- about to fold boolean constants -=-=-=-=-=-=-=-=");
          return this.foldBooleanConstants(this.operator.lexeme, this.left.value(), this.right.value());
        } else {
          switch (this.operator.lexeme) {
            case '+':
              if (isIntegerLiteral(this.right, 0)) {
                return this.left;
              }
              if (isIntegerLiteral(this.left, 0)) {
                return this.right;
              }
              break;
            case '-':
              if (isIntegerLiteral(this.right, 0)) {
                return this.left;
              }
              if (sameVariable(this.left, this.right)) {
                return new IntegerLiteral(0);
              }
              break;
            case '*':
              if (isIntegerLiteral(this.right, 1)) {
                return this.left;
              }
              if (isIntegerLiteral(this.left, 1)) {
                return this.right;
              }
              if (isIntegerLiteral(this.right, 0)) {
                return new IntegerLiteral(0);
              }
              if (isIntegerLiteral(this.left, 0)) {
                return new IntegerLiteral(0);
              }
              break;
            case '/':
              if (isIntegerLiteral(this.right, 1)) {
                return this.left;
              }
              if (sameVariable(this.left, this.right)) {
                return new IntegerLiteral(1);
              }
          }
        }
      return this;
    }

    BinaryExpression.prototype.isIntegerLiteral = function(operand, value) {
      return operand instanceof IntegerLiteral && operand.value === value;
    };

    BinaryExpression.prototype.sameVariable = function(exp1, exp2) {
      return exp1 instanceof VariableReference && exp2 instanceof VariableReference && exp1.referent === exp2.referent;
    };

    BinaryExpression.prototype.foldIntegerConstants = function(op, x, y) {
      console.log("inside foldIntegerConstants");
      switch (op) {
        case '+':
          console.log("'+' case inside foldIntegerConstants");
          // decided to pass in entire tokens to literal entities
          // to facilitate getToken() function standardization throughout all entities
          return new IntegerLiteral({ kind: 'intlit', lexeme: x + y, line: 0, col: 0 });
        case '-':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x - y, line: 0, col: 0 });
        case '*':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x * y, line: 0, col: 0 });
        case '/':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x / y, line: 0, col: 0 });
        case '<':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x < y, line: 0, col: 0 });
        case '<=':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x <= y, line: 0, col: 0 });
        case '==':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x === y, line: 0, col: 0 });
        case '!=':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x !== y, line: 0, col: 0 });
        case '>=':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x >= y, line: 0, col: 0 });
        case '>':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x > y, line: 0, col: 0 });
      }
    };

    BinaryExpression.prototype.foldBooleanConstants = function(op, x, y) {
      switch (op) {
        case '==':
          return new BooleanLiteral(x === y);
        case '!=':
          return new BooleanLiteral(x !== y);
        case 'and':
          return new BooleanLiteral(x && y);
        case 'or':
          return new BooleanLiteral(x || y);
      }
    };

    return BinaryExpression;

})();

module.exports = BinaryExpression;