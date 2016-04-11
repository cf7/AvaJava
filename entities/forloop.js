"use strict";

class ForLoop {
    constructor(id, exp, body) {
        this.id = id;
        this.exp = exp;
        this.body = body;
    }

    toString() {
        return `for each ${this.id} in ${this.exp} { ${this.body} }`;
    }

    analyze(context) {
        // should have own local context for body
    }

}

module.exports = ForLoop;