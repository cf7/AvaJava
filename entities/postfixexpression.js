PostfixExpression = (function () {

    function PostfixExpression (op, operand) {
        this.operator = op;
        this. operand = operand;
    }
    
    return PostfixExpression;
})();

module.exports = PostfixExpression;