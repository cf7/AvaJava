var Type = require('./type.js');
var ReturnStatement = require('./returnstatement.js');

var Function = (function () {
    function Function (params, body) {
        this.params = params; // an array of parsed expressions
        this.body = body; // an array of statements
        this.type = Type.FUNCTION;
    }

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
        localContext.setScope(this);
        // need to analyze variables too
        for (var i = 0; i < this.params.length; i++) {
            localContext.addVariable(this.params[i].id.lexeme, this.params[i]);
        }
        
        console.log("*******inside function's analyze*******");
        // console.log("parentContext: ");
        // console.log(localContext.parent.symbolTable);
        // console.log("localContext: ");
        // console.log(localContext.symbolTable);
        return this.body.analyze(localContext);

        // return this.type = this.getReturnType(this.body, context);
    };

    Function.prototype.optimize = function() {
        console.log("inside Function optimize");
        for (param of this.params) {
            param = param.optimize();
        }
        this.body = this.body.optimize();
        console.log("leaving Function optimize");
        return this;
    };

    return Function;

})();

module.exports = Function;