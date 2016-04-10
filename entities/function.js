Function = (function () {
    function Function (args, body) {
        this.args = args; // an array of parsed expressions
        this.body = body; // an array of statements
    }

    Function.prototype.getNumberArgs = function() {
        return this.args.length;
    };
    Function.prototype.toString = function() {
        return '( args' + ' ( ' + this.args.join(' ') + ' ) ' + ' ( ' + this.body + ' ) ' + ' ) ';
    };

    Function.prototype.analyze = function(context) {
        var localContext = context.createChildContext();
        var results = [];
        localContext.setInsideFunction(true);

        // need to analyze variables too
        for (var i = 0; i < this.args.length; i++) {
            localContext.addVariable(this.args[i]);
        }
        
        console.log("*******inside function's analyze*******");

        return this.body.analyze(localContext);
    };

    return Function;

})();

module.exports = Function;