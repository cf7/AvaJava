"use strict";

var VariableReference = require('./variablereference.js');
var Type = require('./type.js');
var error = require('../error.js');

class ListAccess {
    constructor(id, exps) {
        this.id = id;
        this.exps = exps;
    }

    toString() {
        return this.id.token.lexeme + "[" + this.exps.join('][') + "]";
    }

    analyze(context) {
        // check if list is already declared
        var variable = context.lookupVariable(this.id.token); // this returns a VarDecl
        console.log("variable ))()()()()()()()()()()()(");
        console.log(variable);
        if (this.exps.length > 0) {
            if (this.exps[0] instanceof VariableReference) {
                console.log("___implement variablereference case for ListAccess___");
            } else {
                for (var i = 0; i < this.exps.length; i++) {
                    this.exps[i].analyze(context);
                    // check if parameter is an int
                    this.exps[i].type.mustBeInteger("Index not an integer", this.exps[i]);
                    // check if parameter is out of bounds or not
                    if (parseInt(this.exps[i].value) < 0 || parseInt(this.exps[i].value) > variable.exp.elements.length) {
                        error("Index out of bounds exception", this.exps[i]);
                    }
                }

                
            }
        } else {
            error("No index parameter specified", this.id);
        }
    }
}

module.exports = ListAccess;