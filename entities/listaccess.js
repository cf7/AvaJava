"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var error = require('../error.js');

class ListAccess {
    constructor(id, exps) {
        this.id = id;
        this.exps = exps;
    }

    toString() {
        console.log("ListAccess toString");
        console.log(this.id);
        if (this.id instanceof FunctionCall) { // hardcoding edge case for now
            console.log("case1");
            return this.id + "[" + this.exps.join('][') + "]";
        } else {
            console.log("case2");
            return this.id.token.lexeme + "[" + this.exps.join('][') + "]";
        }
    }

    analyze(context) {
        console.log("inside ListAccess analyze");
        // check if list is already declared

        var variable = context.lookupVariable(this.id.getToken()); // this returns a VarDecl

        console.log(variable);
        var varElements;
        if (variable instanceof VariableDelcaration) {

            // implement function return types
            // need to check for index out of bounds exception
            variable = variable.getExp();

        } else {
            varElements = variable.exp.elements.length;
        }

        variable.type.mustBeCompatibleWith(Type.ITERABLE, "Variable not of type ITERABLE", variable);

        console.log("variable ))()()()()()()()()()()()(");
        console.log(variable);
        if (this.exps.length > 0) {
            for (var i = 0; i < this.exps.length; i++) {
                this.exps[i].analyze(context);

                if (this.exps[i] instanceof VariableReference) {
                    var checkVar = context.lookupVariable(this.exps[i].getToken());
                    checkVar.type.mustBeInteger("Index not an integer", checkVar);

                    // check if parameter is out of bounds or not?
                    // is that static or dynamic?
                    // if (parseInt(checkVar.value) < 0 || parseInt(checkVar.value) > varElements) {
                    //     error("Index out of bounds exception", checkVar);
                    // }
                } else {
                    // check if parameter is an int
                    this.exps[i].type.mustBeInteger("Index not an integer", this.exps[i]);

                    // check if parameter is out of bounds or not?
                    // if (parseInt(this.exps[i].value) < 0 || parseInt(this.exps[i].value) > varElements) {
                    //     error("Index out of bounds exception", this.exps[i]);
                    // }
                    
                }
            }
        } else {
            error("No index parameter specified", this.id);
        }

        console.log("leaving ListAccess analyze");
    }
}

module.exports = ListAccess;