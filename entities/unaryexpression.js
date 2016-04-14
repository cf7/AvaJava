var UnaryExpression = (function () {
    function UnaryExpression (op, operand) {
        this.operator = op;
        this.operand = operand;
    }
    
    UnaryExpression.prototype.toString = function() {
        return `${this.operator.lexeme} ${this.operand}`;
    };
    
    UnaryExpression.prototype.analyze = function(context) {
        this.operand.analyze(context);
        switch (this.op.lexeme) {
          case 'not': // add case for 'not' to work for both booleans and non-booleans
            // this.operand.type.mustBeBoolean('The "not" operator requires a boolean operand', this.op);
            // this.type = Type.BOOL;
            // break;
          case '-':
            this.operand.type.mustBeInteger('The "negation" operator requires an integer operand', this.op);
            this.type = Type.INT;
        }
    };

    return UnaryExpression;
})();

module.exports = UnaryExpression;