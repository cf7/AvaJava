var error = require('../error.js');
var Type = require('./type.js');

var ReturnStatement = (function () {
    function ReturnStatement (value) {
        this.value = value;
    }

    ReturnStatement.prototype.toString = function() {
        return '( return ' + this.value + ' )';
    };
    
    ReturnStatement.prototype.analyze = function(context) {
        if (this.value) {
            this.value.analyze(context);
            if (!context.getInsideFunction()) {
                error("Return statement must be inside a function block.");
            }
            var currentScope = context.getScope();
            console.log("*************");
            console.log("CURRENT SCOPE");
            console.log(currentScope);
            currentScope.returnType = this.value.type;
            console.log("*************");
            console.log("NEW TYPE");
            console.log(currentScope.returnType);
        } else {
            error("Return statement must return a value.");
        }

    };

    ReturnStatement.prototype.optimize = function() {
        this.value = this.value.optimize();
        return this;
    };

    return ReturnStatement;
})();

module.exports = ReturnStatement;