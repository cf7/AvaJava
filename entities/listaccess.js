"use strict";

var VariableReference = require('./variablereference.js');
var Type = require('./type.js');
var error = require('../error.js');

class ListAccess {
    constructor(id, exp) {
        this.id = id;
        this.exp = exp;
    }

    toString() {
        return this.id.lexeme + "[" + this.exp + "]";
    }

    analyze(context) {
        // check if list is already declared
        var variable = context.lookupVariable(this.id); // this returns a VarDecl
        console.log("variable ))()()()()()()()()()()()(");
        console.log(variable);
        if (this.exp) {
            if (this.exp instanceof VariableReference) {
                console.log("___implement variablereference case for ListAccess___");
            } else {
                // this.exp.analyze(context);
                // check if parameter is an int
                this.exp.type.mustBeInteger("Index not an integer", this.exp);

                // check if parameter is out of bounds or not
                if (parseInt(this.exp.value) < 0 || parseInt(this.exp.value) > variable.exp.elements.length) {
                    error("Index out of bounds exception", this.exp);
                }
            }
        } else {
            error("No index parameter specified", this.id);
        }
    }
}

module.exports = ListAccess;