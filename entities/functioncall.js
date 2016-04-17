var error = require('../error.js');
var Type = require('./type.js');

var FunctionCall = (function () {
    function FunctionCall (id, args) {
        this.id = id;
        this.args = args; // array of exp objects, need to get tokens
    }

    // need to be able to get token to lookupvariable
    FunctionCall.prototype.getToken = function() {
        return this.id;
    };

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.args.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        var currentFunction = context.lookupVariable(this.id);
        currentFunction = currentFunction.getExp(); // because of first class functions
        // the Function object is actually stored in the exp of the variabeDeclaration
        console.log("..............FunctionCall Analyze...............");
        //try {
            console.log("current function: " + currentFunction);
            console.log("numberArgs: " + currentFunction.getNumberParams());
            if (currentFunction.getNumberParams() !== this.args.length) {
                error("Incorrect number of argument inputs.");
            } else if (this.args.length > 0) {
                // 1.) check the types of the incoming args and the params
                // 2.) if no type errors, store args in params of the Function
                // 3.) 
                var temporary;
                var variables = [];
                var message;
                for (var i = 0; i < this.args.length; i++) {
                    if (this.args[i].getToken().kind === "id") {
                        console.log("***lookingup***: " + this.args[i].getToken().lexeme);
                        // need to retrieve exp from varDecl
                        temporary = context.lookupVariable(this.args[i].getToken());
                        variables.push(temporary.exp);
                    } else {
                        variables.push(this.args[i]);
                    }
                }
                for (var i = 0; i < variables.length; i++) {
                    // variable coming from outside will already be analyzed by block
                    // variables[i].analyze(context);
                    console.log("==Types==");
                    console.log(currentFunction.params[i].id.lexeme + " : " + currentFunction.params[i].type);
                    console.log(variables[i] + " : " + variables[i].type);
                    console.log("====");
                    message = "Required " + currentFunction.params[i].type + " but found " + variables[i].type;
                    currentFunction.params[i].type.mustBeMutuallyCompatibleWith(variables[i].type, message, currentFunction.params[i]);
                }
            }
        // } catch (typeerror) {
        //     error(this.id.lexeme + " is not a function", this.id);
        // }
    };

    return FunctionCall;
})();

module.exports = FunctionCall;