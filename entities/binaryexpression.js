BinaryExpression = (function () {

    function BinaryExpression (op, left, right) {
        this.operator = op;
        this.left = left;
        this.right = right;
    }
    
    BinaryExpression.prototype.toString = function() {
        return `${op.lexeme} ${left} ${right}`;
    };
    
    return BinaryExpression;
})();

module.exports = BinaryExpression;