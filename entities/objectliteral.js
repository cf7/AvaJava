"use strict";

var Type = require('./type.js');
var error = require('../error.js');

var keywords = ['var', 'while', 'true', 'false', 'not', 
                'for', 'if', 'ava', 'string', 'int', 
                'float', 'bool', '(', 'function',
                'true', 'false', 'list', 'return', 'object', 'set'];

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
        var keys = Object.keys(this.exps);
        for (var property of keys) {
            if (keywords.some(function (word) { return property === word })) {
                error("Cannot use keywords as object keys");
            }
        }
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