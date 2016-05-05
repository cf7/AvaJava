"use strict";

var IfElseStatements = require('./ifelseexpressions.js');
var VariableReference = require('./variablereference.js');

class ForLoop {
    constructor(id, exp, body) {
        this.id = id;
        this.exp = exp;
        this.body = body;
    }

    toString() {
        if (!this.id) {
            return `for ${this.exp} times { ${this.body} }`;
        } else {
            if (this.exp instanceof IfElseStatements) {
                return `for (${this.id}; ${this.exp.conditionals[0]}; ${this.exp.bodies[0].statements}) { ${this.body} }`;
            } else {
                return `for each ${this.id} in ${this.exp} { ${this.body} }`;
            }
        }
    }

    analyze(context) {
        //this.exp.analyze(context); // analyze with broader context
        var localContext = context.createChildContext();
        if (this.id) {
            localContext.addVariable(this.id.lexeme, this.id);
        }


        // check for iterable type
        console.log("TTTTTTTTTTTTTTTTTTTTTT");
        if (!(this.exp instanceof IfElseStatements)) {
            if (this.id) { // the presence of an id is what differentiates the two forloops
                this.exp.analyze(context);
                this.exp.type.mustBeList("Cannot iterate through non-iterable", this.exp);
            } else if (!this.id) {
                // ** bug: variable reference is not being re-assigned different value
                this.exp.analyze(context);
                console.log(this.exp);
                if (this.exp instanceof VariableReference) {
                    this.exp.referent.type.mustBeInteger("index must be an integer", this.exp);
                } else {
                    this.exp.type.mustBeInteger("Index must be an integer", this.exp);
                }
            }
        } else {
            console.log("HHHHHHHHHHHHHHHHH");
            this.exp.analyze(context);
        }

                // should have own local context for body
        this.body.analyze(localContext);
    }

}

module.exports = ForLoop;