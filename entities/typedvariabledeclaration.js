"use strict";
var Type = require('./type.js');

class TypedVariableDeclaration {
    constructor(id, type) {
        this.id = id;
        this.type = type || Type.ARBITRARY;
    }

    toString() {
        return "( " + this.id.lexeme + " : " + this.type + " )";
    }

    analyze(context) {

    }

    optimize() {

    }
}

module.exports = TypedVariableDeclaration;