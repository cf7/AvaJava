"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var ObjectLiteral = require('./objectliteral.js');
var StringLiteral = require('./stringLiteral.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var BuiltIns = require('./builtins.js');
var error = require('../error.js');

class Access {
    constructor(id, exps) {
        this.id = id;
        this.exps = exps;
    }

    getToken() {
        console.log("getToken");
        return this.id.getToken();
    }

    toString() {
        console.log("Access toString");
        console.log(this.id);
        console.log(this.exps);
        if (this.id instanceof FunctionCall) { // hardcoding edge case for now
            console.log("case1");
            return this.id + "[" + this.exps.join('][') + "]"; // for functions that return lists or objects
        } else {
            console.log("case2");
            return this.id.getToken().lexeme + "[" + this.exps.join('][') + "]";
        }
    }

    analyze(context) {
        console.log("----------inside Access analyze----------");
        console.log(this.id);
        
        // check if list is already declared
        var variable = context.lookupVariable(this.id.getToken()); // this returns a VarDecl

        console.log(variable);
        var varElements;


        // ***
        // something is stopping the analyzer
        // ***

        // ** checking to see if contains is passed in as FunctionCall
        // ** in syntax, added parens to end of .length() so it is
        // ** parsed as a FunctionCall
        // ** FunctionCalls will be stored in this.exps if this is the case
        if (this.exps[0] instanceof FunctionCall) {
            console.log("0000000000000000 inside variable FunctionCall Access 000000000000");
            return this.exps[0].analyze(context);
        } else {






            if (variable instanceof VariableDelcaration) {

                // implement function return types
                // need to check for index out of bounds exception
                variable = variable.getExp();

            } 
            // might not need these
            // else if (variable.type === Type.ITERABLE) {
            //     varElements = variable.exp.elements.length;
            // } else if (variable.type === Type.OBJECT) {
            //
            // }
            variable.analyze(context);

            // experimenting with type checking
            // variable.type.addValidType(Type.ITERABLE, "access");
            // variable.type.addValidType(Type.OBJECT, "access");
            // variable.type.addValidType(Type.FUNCTION, "builtin");
            // variable.type.isValidType("access", "Variable not of type ITERABLE or type OBJECT", variable);
            // variable.type.removeValidType(Type.ITERABLE, "access");
            // variable.type.removeValidType(Type.OBJECT, "access");
            // variable.type.removeValidType(Type.FUNCTION, "builtin");

            variable.type.canBeListOrObj("Variable not of type LIST or type OBJECT", variable);

            console.log("variable ))()()()()()()()()()()()(");
            console.log(variable);
           
            if (this.exps.length > 0 && this.exps[0]) {
                for (var i = 0; i < this.exps.length; i++) {
                    // this.exps[i].analyze(context);
                    var checkVar = this.exps[i];

                    // make sure the object contains this key
                    // if (variable instanceof ObjectLiteral && !(variable.exps.hasOwnProperty(checkVar.getToken().lexeme))) {
                    //     error("Property not found in object", checkVar.getToken());
                    // }

                    // ** for builtins test case
                    // -- contains is parsed as a FunctionCall
                    // -- length is parsed as a varref
                    // need to keep contains as a functioncall
                    // need to change length to FunctionCall
                    if (checkVar instanceof Access) {
                        // checkVar.analyze(context);

                        console.log("is the analyzer entering in here?");

                    } else {
                        // what if variable is an array?
                        if (variable.exps instanceof Object) {
                            if (checkVar instanceof VariableReference && variable.exps.hasOwnProperty(checkVar.getToken().lexeme)) {
                               // turn them into string literals so that generator does not
                               // confuse them for variableReferences later on
                               console.log("converting access properties to StringLiteral");
                               this.exps[i] = new StringLiteral(checkVar.getToken());
                               this.exps[i].string = '\'' + this.exps[i].string + '\'';
                               console.log(this.exps[i]);
                            } else if (checkVar instanceof VariableReference && !variable.exps.hasOwnProperty(checkVar.getToken().lexeme)) {
                                checkVar = context.lookupVariable(checkVar.getToken());
                                console.log("before canBeIntOrString");
                                console.log(checkVar);
                                checkVar.type.canBeIntOrString("Index not an integer or a string", checkVar);
                                console.log(checkVar);
                            }
                        }
                        
                    }
                }
            } else {
                error("No index parameter specified", this.id);
            }
        }
        console.log("leaving Access analyze");
    }
}

module.exports = Access;