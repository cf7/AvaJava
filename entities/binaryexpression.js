BinaryExpression = (function () {

    function BinaryExpression (op, left, right) {
        this.operator = op;
        this.left = left;
        this.right = right;
    }
    
    return BinaryExpression;
})();

module.exports = BinaryExpression;