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
        this.args = args; // array of exp objects, need to get tokens
        this.type = Type.FUNCTION;
        this.returnType = Type.ARBITRARY;
    }

    FunctionCall.prototype.getArgs = function() {
        return this.args;
    };

    // need to be able to get token to lookupvariable
    FunctionCall.prototype.getToken = function() {
        return this.id;
    };

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.args.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        console.log("..............FunctionCall Analyze...............");

        var currentFunction = context.lookupVariable(this.id);
        console.log(currentFunction);
        if (!(currentFunction instanceof TypedVariableDeclaration)) {
            if (new BuiltIns().entities[this.id.lexeme]) {
                return;
            } else {
                currentFunction = currentFunction.getExp(); // because of first class functions
                // the Function object is actually stored in the exp of the variabeDeclaration
                this.returnType = currentFunction.returnType;
                console.log(this.id);
                console.log("here");
                console.log(currentFunction);
                console.log("there");
                var newArgs = [];
                var temporary;
                var curried = false;
                for (var i = 0; i < this.args.length; i++) {
                    console.log(this.args[i]);
                    if (this.args[i] instanceof FunctionCall) {
                        temporary = context.lookupVariable(this.args[i].getToken());
                        // currying
                        // if an arg is a functioncall
                        // and the lookup of the id is a VarDeclaration
                        // and the VarDecl' exp is not an instance of Function
                        // then the arg is actually an variable for a value
                        // in that case . . . 
                        // recursively recover the args of that args
                        // to flatten the rest of the args into the current top-level array
                        console.log("just before");
                    
                        console.log(temporary);
                        if (temporary instanceof VariableDeclaration) {
                            if (temporary.exp && !(temporary.exp instanceof Function)) {
                                console.log(this.args[i].getArgs());
                                newArgs.push(new VariableReference(this.args[i].getToken()));
                                newArgs = newArgs.concat(this.args[i].getArgs());
                                console.log(newArgs);
                                curried = true;
                            }
                        }
                    }
                }
                console.log("NEW ARGS =============");
                console.log(newArgs);
                // find way to replace previous args with newArgs
                if (curried) {
                    for (x of this.args) {
                        this.args.shift();
                    }
                    this.args = this.args.concat(newArgs);
                }

                console.log("current function: " + currentFunction);
                console.log("numberParams required: " + currentFunction.getNumberParams());
                console.log("numberArgs input: " + this.args.length);
                if (currentFunction.getNumberParams() !== 0) {
                    if (!this.args[0] || currentFunction.getNumberParams() !== this.args.length) {
                        error("Incorrect number of argument inputs.");
                    } else if (this.args.length > 0 && this.args[0]) {
                        // 1.) check the types of the incoming args and the params
                        // 2.) if no type errors, store args in params of the Function
                        // 3.) 

                        // var temporary;
                        var variables = [];
                        var message;

                        for (var i = 0; i < this.args.length; i++) {
                            this.args[i].analyze(context); // do they need to be analyzed?
                            console.log(this.args[i]);
                            if (this.args[i].getToken().kind === "id") {
                                console.log("***lookingup***: " + this.args[i].getToken().lexeme);
                                temporary = context.lookupVariable(this.args[i].getToken());
                                variables.push(temporary.exp);

                            } else {
                                variables.push(this.args[i]);
                            }
                        }
                        for (var i = 0; i < variables.length; i++) {
                            // variable coming from outside will already be analyzed by block
                            // variables[i].analyze(context);
                            var checkType = variables[i].type;
                            if (variables[i].type === Type.FUNCTION) {
                                checkType = variables[i].returnType;
                            }
                            console.log("==Types==");
                            console.log(currentFunction.params[i].id.lexeme + " : " + currentFunction.params[i].type);
                            console.log(variables[i] + " : " + checkType);
                            console.log("====");
                            message = "Required " + currentFunction.params[i].type + " but found " + checkType;
                            currentFunction.params[i].type.mustBeMutuallyCompatibleWith(checkType, message, currentFunction.params[i]);
                        }
                    }
                }
            }
        }
    };

    return FunctionCall;
})();

module.exports = FunctionCall;