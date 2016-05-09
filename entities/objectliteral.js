"use strict";

var Type = require('./type.js');
var error = require('../error.js');

class ObjectLiteral {
    constructor(exps) {
        this.exps = exps;
        this.type = Type.OBJECT;
    }

    toString() {
        var keys = Object.keys(this.exps);
        var strings = [];
        for (var property of keys) {
            strings.push(property + ":" + this.exps[property]);
        }
        return "{" + strings.join(',') + "}";
    }

    analyze(context) {
        return this.type = Type.OBJECT;
    }

    optimize() {
        var keys = Object.keys(this.exps);
        for (var property of keys) {
            this.exps[property] = this.exps[property].optimize();
        }
        return this;
    }
}

module.exports = ObjectLiteral;