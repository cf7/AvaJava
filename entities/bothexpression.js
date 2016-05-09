var BothExpression = (function () {

    function BothExpression (left, right) {
        console.log(left);
        console.log(right);
        this.left = left;
        this.right = right;
    }
    
    BothExpression.prototype.toString = function() {
        return `( ${this.left} both ${this.right} )`;
    };

    BothExpression.prototype.analyze = function(context) {
        
    };

    BothExpression.prototype.optimize = function() {
        
    };
    
    return BothExpression;
})();

module.exports = BothExpression;