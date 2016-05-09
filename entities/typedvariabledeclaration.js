"use strict";
var Type = require('./type.js');

class TypedVariableDeclaration {
    constructor(id, type) {
        this.id = id;
        this.type = type || Type.ARBITRARY;
        this.exp = { type: this.type };

    }

    getExp() {
        return this.exp;
    }
    
    toString() {
        return "( " + this.id.lexeme + " : " + this.type + " )";
    }

    analyze(context) {
        context.variableMustNotBeAlreadyDeclared(this.id);
        context.addVariable(this.id.lexeme, this);
        return this.type;
    }

    optimize() {
        return this;
    }
}

module.exports = TypedVariableDeclaration;