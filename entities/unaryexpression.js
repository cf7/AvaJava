var Type = require('./type.js');

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
        switch (this.operator.lexeme) {
            case 'not':
                this.operand.type.canBeIntOrBool('The "not" operator requires a boolean or int operand', this.operator)
                this.type = Type.BOOL;
                break;
            case '-':
                this.operand.type.mustBeInteger('The "negation" operator requires an integer operand', this.operator);
                this.type = Type.INT;
                break;
            default:

        }
    };

    UnaryExpression.prototype.optimize = function() {
        
    };
    
    return UnaryExpression;
})();

module.exports = UnaryExpression;