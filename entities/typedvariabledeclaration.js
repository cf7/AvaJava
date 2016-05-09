"use strict";
var Type = require('./type.js');

class TypedVariableDeclaration {
    constructor(id, type) {
        this.id = id;
        this.type = type || Type.ARBITRARY;
        this.exp = { type: this.type }; // hardcoding this for VariableReference for now

    }

    getExp() {
        return this.exp;
    }
    
    toString() {
        return "( " + this.id.lexeme + " : " + this.type + " )";
    }

    analyze(context) {
        console.log("--------inside typeVarDecl analyze-------");
        console.log("current variable: " + this.id.lexeme);
    
        context.variableMustNotBeAlreadyDeclared(this.id);
        context.addVariable(this.id.lexeme, this);
        return this.type;
    }

    optimize() {

    }
}

module.exports = TypedVariableDeclaration;