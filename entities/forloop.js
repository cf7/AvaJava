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
        // should have own local context for body
        // check for iterable type
    }

}

module.exports = ForLoop;