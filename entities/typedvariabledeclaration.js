"use strict";
var Type = require('./type.js');

class TypedVariableDeclaration {
    constructor(id, type) {
        this.id = id;
        this.type = type || Type.ARBITRARY;
        this.exp = { type: this.type }; // hardcoding this for VariableReference for now

    }

    toString() {
        return "( " + this.id.lexeme + " : " + this.type + " )";
    }

    analyze(context) {
        // need to account for if variable is a single number
        // a list of expressions
        // or a function

        // Type inference in here!!!
        // Swift: once type is inferred, type cannot change
        context.variableMustNotBeAlreadyDeclared(this.id);
        context.addVariable(this.id.lexeme, this); // adds var to symbol table and returns symbol table
        console.log("--------inside typeVarDecl analyze-------");
        console.log("current variable: " + this.id.lexeme);
        return this.type;
    }

    optimize() {

    }
}

module.exports = TypedVariableDeclaration;