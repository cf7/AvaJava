"use strict";

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
    }

}

module.exports = ForLoop;