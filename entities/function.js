var Type = require('./type.js');
var ReturnStatement = require('./returnstatement.js');

var Function = (function () {
    function Function (params, body) {
        this.params = params;
        this.body = body;
        this.type = Type.FUNCTION;
        this.returnType = Type.ARBITRARY;
    }

    Function.prototype.getNumberParams = function() {
        return this.params.length;
    };
    Function.prototype.toString = function() {
        return '( params' + ' ( ' + this.params.join(' ') + ' ) ' + ' ( ' + this.body + ' ) ' + ' ) ';
    };

    Function.prototype.analyze = function(context) {
        var localContext = context.createChildContext();
        
        var results = [];
        localContext.setInsideFunction(true);
        localContext.setScope(this);

        for (var i = 0; i < this.params.length; i++) {
            localContext.addVariable(this.params[i].id.lexeme, this.params[i]);
        }
    
        return this.body.analyze(localContext);
    };

    Function.prototype.optimize = function() {
        for (param of this.params) {
            param = param.optimize();
        }
        this.body = this.body.optimize();
        return this;
    };

    return Function;

})();

module.exports = Function;