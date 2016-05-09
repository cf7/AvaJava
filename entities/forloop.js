"use strict";

var IfElseStatements = require('./ifelseexpressions.js');
var VariableReference = require('./variablereference.js');
var IntegerLiteral = require('./integerliteral.js');

class ForLoop {
    constructor(id, exp, body) {
        this.id = id;
        this.exp = exp;
        this.body = body;
    }

    toString() {
        if (this.exp instanceof IfElseStatements) {
            return `for (${this.id}; ${this.exp.conditionals[0]}; ${this.exp.bodies[0].statements}) { ${this.body} }`;
        } else {
            return `for each ${this.id} in ${this.exp} { ${this.body} }`;
        }
    }

    analyze(context) {
        var localContext = context.createChildContext();
        if (this.id) {
            // localContext.addVariable(this.id.lexeme, this.id);
            console.log(this.id);
            if (!this.id.exp) { // for-each case
                this.id.exp = new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
            }
            this.id.analyze(localContext);
        }

        console.log("TTTTTTTTTTTTTTTTTTTTTT");
        if (!(this.exp instanceof IfElseStatements)) {
            if (this.id) {
                this.exp.analyze(localContext);
                this.exp.type.mustBeList("Cannot iterate through non-iterable", this.exp);
            }
        } else {
            console.log("HHHHHHHHHHHHHHHHH");
            this.exp.analyze(localContext);
        }

        this.body.analyze(localContext);
    }

    optimize() {
        
    }

}

module.exports = ForLoop;