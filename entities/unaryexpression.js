var UnaryExpression = (function () {
    function UnaryExpression (op, operand) {
        this.operator = op;
        this.operand = operand;
    }
    
    return UnaryExpression;
})();

module.exports = UnaryExpression;