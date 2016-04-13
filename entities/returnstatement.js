var error = require('../error.js');

var ReturnStatement = (function () {
    function ReturnStatement (value) {
        this.value = value;
    }

    ReturnStatement.prototype.toString = function() {
        return '( return ' + this.value + ' )';
    };
    
    ReturnStatement.prototype.analyze = function(context) {
        if (!context.getInsideFunction()) {
            error("Return statement must be inside a function block.");
        }
    };
    return ReturnStatement;
})();

module.exports = ReturnStatement;