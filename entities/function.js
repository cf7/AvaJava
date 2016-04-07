Function = (function () {
    function Function (args, body) {
        this.args = args; // an array of parsed expressions
        this.body = body; // an array of statements
    }

    Function.prototype.toString = function() {
        return '( args' + this.args.join(' ') + '( ' + this.body + ' )' + ' )';
    };

    Function.prototype.analyze = function(context) {
        var localContext = context.createChildContext();
        var results = [];
        localContext.setInsideFunction(true);
        for (var i = 0; i < arg.length; i++) {
            localContext.addVariable(args[i]);
        }
        for (var i = 0; i < body.length; i++) {
            results.push(body[i].analyze(localContext));
        }
        return results;
    };

    return Function;

})();

module.exports = Function;