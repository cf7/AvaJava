var UnaryExpression = (function () {
    function UnaryExpression (op, operand) {
        this.operator = op;
        this.operand = operand;
    }
    
    UnaryExpression.prototype.toString = function() {
        return `${this.operator.lexeme} ${this.operand}`;
    };
    
    return UnaryExpression;
})();

module.exports = UnaryExpression;