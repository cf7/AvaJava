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
            context.variableMustNotAlreadyBeDeclared(this.id.getToken());
            if (!this.id.exp) {
                this.id.exp = new IntegerLiteral({ kind: 'intlit', lexeme: '0', line: 0, col: 0 });
            }
            this.id.analyze(localContext);
        }

        if (!(this.exp instanceof IfElseStatements)) {
            if (this.id) {
                this.exp.analyze(localContext);
                this.exp.type.mustBeList("Cannot iterate through non-iterable", this.exp);
            }
        } else {
            this.exp.analyze(localContext);
        }

        this.body.analyze(localContext);
    }

    optimize() {
        this.id = this.id.optimize();
        this.exp = this.exp.optimize();
        this.body = this.body.optimize();
        return this;
    }

}

module.exports = ForLoop;