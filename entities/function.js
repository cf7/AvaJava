Function = (function () {
    function Function (args, body) {
        this.args = args; // an array of parsed expressions
        this.body = body; // an array of statements
    }

    Function.prototype.toString = function() {
        return '( args' + this.args.join(' ') + ' ( ' + this.body + ' ) ' + ' ) ';
    };

    Function.prototype.analyze = function(context) {
        var localContext = context.createChildContext();
        var results = [];
        localContext.setInsideFunction(true);
        for (var i = 0; i < this.args.length; i++) {
            localContext.addVariable(this.args[i]);
        }
        for (var i = 0; i < this.body.length; i++) {
            results.push(this.body[i].analyze(localContext));
        }
        console.log("*******inside function's analyze*******");
        return results;
    };

    return Function;

})();

module.exports = Function;