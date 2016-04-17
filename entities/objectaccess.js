"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var error = require('../error.js');

class ObjectAccess {
    constructor(id, exps) {
        this.id = id;
        this.exps = exps; 
    }

    toString() {
        console.log("ObjectAccess toString");
        console.log(this.id);
        if (this.id instanceof FunctionCall) { // hardcoding edge case for now
            console.log("case1");
            return this.id + "[" + this.exps.join('][') + "]";
        } else {
            console.log("case2");
            return this.id.token.lexeme + "[" + this.exps.join('][') + "]";
        }
    }

    analyze(context) {
        // each exp must be either an integer or a string
        // the key must exist in the object

        if (this.exps.length > 0 && this.exps[0]) {
            for (var i = 0; i < this.exps.length; i++) {
                this.exps[i].analyze(context);
                var checkVar = this.exps[i];
                if (checkVar instanceof VariableReference) {
                    checkVar = context.lookupVariable(checkVar.getToken());
                }
                checkVar.type.canBeIntOrString("Index not an integer", checkVar);
            }
        }
    }

    optimize() {

    }
}