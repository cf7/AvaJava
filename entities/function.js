var Type = require('./type.js');
var ReturnStatement = require('./returnstatement.js');

var Function = (function () {
    function Function (params, body) {
        this.params = params; // an array of parsed expressions
        this.body = body; // an array of statements
        this.type = Type.FUNCTION;
    }

    Function.prototype.getReturnType = function(block) {
        console.log("inside get return type");
        var returnTypes = this.findReturns(block);
        var allEqual = true;
        for (var i = 0; i < returnTypes.length; i++) {
            if (returnTypes[0] !== returnTypes[i]) {
                allEqual = false;
            }
        }
        if (!allEqual) {
            error("Return types not the matching", this);
            return Type.FUNCTION;
        } else {
            return returnTypes[0];
        }
    };

    Function.prototype.findReturns = function(block) {
        var statements = block.statements;
        var returnTypes = [];
        for (var i = 0; i < statements.length; i++) {
            if (statements[i].body) {
                returnTypes.concat(this.findReturns(statements[i].body));
            } else if (statements[i] instanceof ReturnStatement) {
                returnTypes.push(statements[i].value.type);
            }
        }
        return returnTypes;
    };

    Function.prototype.getNumberParams = function() {
        return this.params.length;
    };
    Function.prototype.toString = function() {
        return '( params' + ' ( ' + this.params.join(' ') + ' ) ' + ' ( ' + this.body + ' ) ' + ' ) ';
    };

    Function.prototype.analyze = function(context) {
        // need to check for return statements!!!

        var localContext = context.createChildContext();
        // shouldn't be creating child context here
        // new local context will be created anyway when function enters
        
        var results = [];
        localContext.setInsideFunction(true);
        
        // need to analyze variables too
        for (var i = 0; i < this.params.length; i++) {
            localContext.addVariable(this.params[i].id.lexeme, this.params[i]);
        }
        
        console.log("*******inside function's analyze*******");
        // console.log("parentContext: ");
        // console.log(localContext.parent.symbolTable);
        // console.log("localContext: ");
        // console.log(localContext.symbolTable);
        this.body.analyze(localContext);

        return this.type = this.getReturnType(this.body);
    };

    return Function;

})();

module.exports = Function;