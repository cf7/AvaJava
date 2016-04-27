"use strict";

var Type = require('./type.js');

// each property of the builtins needs to have its own code to be generated
// they are like mini-entities

class BuiltIns {
    constructor() {
        this.entities = {
            contains: {
                value: {},
                type: Type.FUNCTION,
                generateCode: function (args) {
                    console.log("inside builtin contains");
                    console.log(args);
                    // by this point, will know that first two elements are 
                    // the correct arguments, because should have been analyzed by now
                    return args[0] + ".has(" + args[1] + ")";
                }
            },

            length: {
                value: {},
                type: Type.FUNCTION,
                generateCode: function (args) {
                    return args[0] + ".length";
                }
            },

            map: {
                value: {},
                type: Type.FUNCTION,
                generateCode: function (args) {
                    return args[1] + '.map(' + args[0] + ')';
                }
            },

            push: {
                value: {},
                type: Type.FUNCTION,
                generateCode: function (args) {
                    return args[0] + '.push(' + args[1] + ')';
                }
            },

            pull: {

            },
        }
    }

}

module.exports = BuiltIns;