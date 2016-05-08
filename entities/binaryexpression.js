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
        this.leftType = Type.ARBITRARY;
        this.rightType = Type.ARBITRARY;
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
        this.right.analyze(context);
        console.log("this.left.type###########: " + this.left.type);
        console.log("this.right.type###########: " + this.left.type);
        if (this.left.type === Type.FUNCTION) {
          this.leftType = this.left.returnType;
        } else {
          this.leftType = this.left.type;
        }
        if (this.right.type === Type.FUNCTION) {
          this.rightType = this.right.returnType;
        } else {
          this.rightType = this.right.type;
        }
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
          case '@':
            this.mustHaveCompatibleOperands(); // want to be able to support
            // ints and strings
            return this.type = this.left.type;
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
        console.log("inside mustHaveIntegerOperands: " + this.leftType);
        this.leftType.mustBeCompatibleWith(Type.INT, error, this.operator);
        return this.rightType.mustBeCompatibleWith(Type.INT, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveBooleanOperands = function() {
        var error = this.operator.lexeme + " must have boolean operands";
        this.leftType.mustBeCompatibleWith(Type.BOOL, error, this.operator);
        return this.rightType.mustBeCompatibleWith(Type.BOOL, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveCompatibleOperands = function() {
        var error = this.operator.lexeme + " must have mutually compatible operands";
        return this.leftType.mustBeMutuallyCompatibleWith(this.rightType, error, this.operator);
    }

    BinaryExpression.prototype.canHaveDifferentOperands = function() {
        console.log("^^^^^^^^ canHaveDifferentOperands ^^^^^^^^^");
        console.log(this.leftType);
        console.log(this.rightType);
        var error = this.operator.lexeme + " must have either both integers, an integer and a string";
        Type.INT.canBeCompatibleWith(Type.INT, '*');
        Type.INT.canBeCompatibleWith(Type.STRING, '*');
        Type.STRING.canBeCompatibleWith(Type.INT, '*');
        Type.INT.canBeCompatibleWith(Type.INT, '+');
        Type.INT.canBeCompatibleWith(Type.STRING, '+');
        Type.STRING.canBeCompatibleWith(Type.INT, '+');

        Type.STRING.canBeCompatibleWith(Type.STRING, '+');
        console.log("left");
        console.log(this.left);
        console.log("right");
        console.log(this.right);
        return this.leftType.isMixedCompatibleWith(this.rightType, this.operator.lexeme, error, this.operator);
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
              if (this.isIntegerLiteral(this.right, 0)) {
                return this.left;
              }
              if (this.isIntegerLiteral(this.left, 0)) {
                return this.right;
              }
              break;
            case '-':
              if (this.isIntegerLiteral(this.right, 0)) {
                return this.left;
              }
              if (this.sameVariable(this.left, this.right)) {
                return new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
              }
              break;
            case '*':
              if (this.isIntegerLiteral(this.right, 1)) {
                return this.left;
              }
              if (this.isIntegerLiteral(this.left, 1)) {
                return this.right;
              }
              if (this.isIntegerLiteral(this.right, 0)) {
                return new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
              }
              if (this.isIntegerLiteral(this.left, 0)) {
                return new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
              }
              break;
            case '/':
              if (this.isIntegerLiteral(this.right, 1)) {
                return this.left;
              }
              if (this.sameVariable(this.left, this.right)) {
                return new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
              }
          }
        }
      return this;
    }

    BinaryExpression.prototype.isIntegerLiteral = function(operand, value) {
      // console.log("|| Inside isIntegerLiteral in BinaryExpression Optimizer ||");
      // console.log(operand);
      var valid = false;
      var valueExp = '';
      if (operand.referent) {
        valid = operand.referent.exp instanceof IntegerLiteral;
        valueExp = valid ? operand.referent.exp.value : valueExp;
      } else if (operand instanceof IntegerLiteral) {
        valid = true;
        valueExp = operand.value;
      }
      return valid && (parseInt(valueExp) === value);
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
          // to facilitate getToken() function standardization that all entities use
          return new IntegerLiteral({ kind: 'intlit', lexeme: x + y, line: 0, col: 0 });
        case '-':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x - y, line: 0, col: 0 });
        case '*':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x * y, line: 0, col: 0 });
        case '/':
          return new IntegerLiteral({ kind: 'intlit', lexeme: x / y, line: 0, col: 0 });
        case '^^':
          return new IntegerLiteral({ kind: 'intlit', lexeme: Math.pow(x, y), line: 0, col: 0 });
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
          return new BooleanLiteral({ kind: 'boolit', lexeme: x == y, line: 0, col: 0 });
        case '!=':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x != y, line: 0, col: 0 });
        case 'and':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x && y, line: 0, col: 0 });
        case 'or':
          return new BooleanLiteral({ kind: 'boolit', lexeme: x || y, line: 0, col: 0 });
      }
    };

    return BinaryExpression;

})();

module.exports = BinaryExpression;