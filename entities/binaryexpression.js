var BinaryExpression = (function () {

    function BinaryExpression (op, left, right) {
        console.log(op.lexeme);
        this.operator = op;
        this.left = left;
        this.right = right;
    }
    
    BinaryExpression.prototype.toString = function() {
        return `${this.operator.lexeme} ${this.left} ${this.right}`;
    };
    
    BinaryExpression.prototype.analyze = function(context) {
        
    };
    
    return BinaryExpression;
})();

module.exports = BinaryExpression;