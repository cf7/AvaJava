var error = require('../error.js');

var ReturnStatement = (function () {
    function ReturnStatement (value) {
        this.value = value;
    }

    ReturnStatement.prototype.toString = function() {
        return '( return ' + this.value + ' )';
    };
    
    ReturnStatement.prototype.analyze = function(context) {
        this.value.analyze(context);
        if (!context.getInsideFunction()) {
            error("Return statement must be inside a function block.");
        }
        var currentScope = context.getScope();
        console.log("*************");
        console.log("CURRENT SCOPE");
        console.log(currentScope);
        currentScope.type = this.value.type;
        console.log("*************");
        console.log("NEW TYPE");
        console.log(currentScope.type);
        // setting the return type for the function!!!

    };

    ReturnStatement.prototype.optimize = function() {
        this.value = this.value.optimize();
        return this;
    };

    return ReturnStatement;
})();

module.exports = ReturnStatement;