"use strict";

var Type = require('./type.js');

class BuiltIns {
    constructor() {
        this.entities = {
            contains: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.BOOL,
                generateCode: function (args) {
                    return args[0] + ".has(" + args[1] + ")";
                }
            },

            length: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.INT,
                generateCode: function (args) {
                    return args[0] + ".length";
                }
            },

            map: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.INT,
                generateCode: function (args) {
                    return args[1] + '.map(' + args[0] + ')';
                }
            },

            push: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.INT,
                generateCode: function (args) {
                    return args[0] + '.push(' + args[1] + ')';
                }
            },

            pop: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.ARBITRARY,
                generateCode: function (args) {
                    return args[0] + '.pop()';
                }
            },

            export: {
                value: {},
                type: Type.FUNCTION,
                returnType: Type.ARBITRARY,
                generateCode: function (args) {
                    return 'module.exports = ' + args[0];
                }
            }
        }
    }

}

module.exports = BuiltIns;