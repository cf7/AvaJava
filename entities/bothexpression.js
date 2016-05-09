var Type = require('./type.js');

var BothExpression = (function () {

    function BothExpression (left, right) {
        this.left = left;
        this.right = right;
        this.type = Type.BOOL;
    }
    
    BothExpression.prototype.toString = function() {
        return `( ${this.left} both ${this.right} )`;
    };

    BothExpression.prototype.analyze = function(context) {
        return this;
    };

    BothExpression.prototype.optimize = function() {
        this.left = this.left.optimize();
        this.right = this.right.optimize();
        return this;
    };
    
    return BothExpression;
})();

module.exports = BothExpression;