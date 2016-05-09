var error = require('../error.js');
var Type = require('./type.js');
var BuiltIns = require('./builtins.js');
var ReturnStatement = require('./returnstatement.js');
var VariableDeclaration = require('./variabledeclaration.js');
var TypedVariableDeclaration = require('./typedvariabledeclaration.js');
var VariableReference = require('./variablereference.js');
var Function = require('./function.js');

var FunctionCall = (function () {
    function FunctionCall (id, args) {
        this.id = id;
        this.args = args;
        this.type = Type.FUNCTION;
        this.returnType = Type.ARBITRARY;
    }

    FunctionCall.prototype.getArgs = function() {
        return this.args;
    };

    FunctionCall.prototype.getToken = function() {
        return this.id;
    };

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.args.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        var currentFunction = context.lookupVariable(this.id);
        if (!(currentFunction instanceof TypedVariableDeclaration)) {
            if (new BuiltIns().entities[this.id.lexeme]) {
                return;
            } else {
                currentFunction = currentFunction.getExp();
                if (currentFunction instanceof Function) {
                    this.returnType = currentFunction.returnType;

                    var newArgs = [];
                    var temporary;
                    var curried = false;
                    for (var i = 0; i < this.args.length; i++) {
                        if (this.args[i] instanceof FunctionCall) {
                            temporary = context.lookupVariable(this.args[i].getToken());
                            if (temporary instanceof VariableDeclaration) {
                                if (temporary.exp && !(temporary.exp instanceof Function)) {
                                    newArgs.push(new VariableReference(this.args[i].getToken()));
                                    newArgs = newArgs.concat(this.args[i].getArgs());
                                    curried = true;
                                }
                            }
                        }
                    }

                    if (curried) {
                        for (x of this.args) {
                            this.args.shift();
                        }
                        this.args = this.args.concat(newArgs);
                    }

                    if (currentFunction.getNumberParams() !== 0) {
                        if (!this.args[0] || currentFunction.getNumberParams() !== this.args.length) {
                            error("Incorrect number of argument inputs.");
                        } else if (this.args.length > 0 && this.args[0]) {

                            var variables = [];
                            var message;

                            for (var i = 0; i < this.args.length; i++) {
                                this.args[i].analyze(context);
                                if (this.args[i].getToken().kind === "id") {
                                    temporary = context.lookupVariable(this.args[i].getToken());
                                    variables.push(temporary.exp);
                                } else {
                                    variables.push(this.args[i]);
                                }
                            }
                            for (var i = 0; i < variables.length; i++) {
                                var checkType = variables[i].type;
                                if (variables[i].type === Type.FUNCTION && currentFunction.params[i].type !== Type.FUNCTION) {
                                    checkType = variables[i].returnType;
                                }
                                message = "Required " + currentFunction.params[i].type + " but found " + checkType;
                                currentFunction.params[i].type.mustBeMutuallyCompatibleWith(checkType, message, currentFunction.params[i]);
                            }
                        }
                    }
                } else {
                    error("Calling nonfunction", this);
                }
            }
        }
    };

    FunctionCall.prototype.optimize = function() {
        for (var i = 0; i < this.args.length; i += 1) {
            this.args[i] = this.args.optimize();
        }
        return this;
    };
    
    return FunctionCall;
})();

module.exports = FunctionCall;