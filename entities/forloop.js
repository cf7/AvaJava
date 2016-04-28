"use strict";

var IfElseStatements = require('./ifelseexpressions.js');

class ForLoop {
    constructor(id, exp, body) {
        this.id = id;
        this.exp = exp;
        this.body = body;
    }

    toString() {
        if (!this.id) {
            return `for ${this.exp} times { ${this.body} }`;
        } else if (this.exp instanceof IfElseStatements) {
            return `for (${this.id}; ${this.exp.conditional}; ${this.exp.body.statements}) { ${this.body} }`;
        } else {
            return `for each ${this.id} in ${this.exp} { ${this.body} }`;
        }
    }

    analyze(context) {
        // this.exp.analyze(context); // analyze with broader context
        // var localContext = context.createChildContext();
        // localContext.addVariable(this.id.lexeme, this.id);
        // // should have own local context for body
        // return this.body.analyze(localContext);
        // // check for iterable type

        if (this.id && !(this.exp instanceof IfElseStatements)) { // the presence of an id is what differentiates the two forloops
            this.exp.analyze(context);
            this.exp.type.mustBeList("Cannot iterate through non-iterable", this.exp);
        } else if (!this.id) {
            this.exp.analyze(context);
            this.exp.type.mustBeInteger("Index must be an integer", this.exp);
        }
    }

}

module.exports = ForLoop;