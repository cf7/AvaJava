"use strict";

var Type = require('./type.js');
var error = require('../error.js');

class ObjectLiteral {
    constructor(exps) {
        this.exps = exps; // object containing key-value pairs
        this.type = Type.OBJECT;
    }

    toString() {
        console.log("object literal toString: " + this.exps.toString());
        var keys = Object.keys(this.exps);
        console.log("keys: " + keys);
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

    }
}

module.exports = ObjectLiteral;