"use strict";
var error = require('../error.js');
// var variableDeclaration = require('../entities/VariableDeclaration');

class AnalysisContext {

    constructor(parent) {
        this.symbolTable = {};
    }

    initialContext() {
        new AnalysisContext(null);
    }

    createChildContext() {
        new AnalysisContext(this);
    }

}

exports.initialContext = AnalysisContext.initialContext;