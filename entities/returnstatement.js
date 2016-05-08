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

        /**
            Features that depend on function return types:
            -currying
            -type inference
            -higher-order functions
            -typed parameters
            -built-in functions

            If we take out function return types, we lose
            complete functionality for these features
            If we keep function return types, we lose
            higher-order functions
        */
        if (this.value) {
            this.value.analyze(context);
            if (!context.getInsideFunction()) {
                error("Return statement must be inside a function block.");
            }
            var currentScope = context.getScope();
            console.log("*************");
            console.log("CURRENT SCOPE");
            console.log(currentScope);
            // currentScope.returnType = this.value.type;
            currentScope.returnType = this.value.type;
            console.log("*************");
            console.log("NEW TYPE");
            console.log(currentScope.returnType);
            // setting the return type for the function!!!
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