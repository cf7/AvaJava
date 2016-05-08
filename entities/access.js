"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var ObjectLiteral = require('./objectliteral.js');
var StringLiteral = require('./stringLiteral.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var BuiltIns = require('./builtins.js');
var AssignmentStatement = require('./assignmentstatement.js');
var error = require('../error.js');

class Access {
    constructor(id, dot, exp) {
        this.id = id;
        this.dot = dot;
        this.exp = exp;
    }

    getToken() {
        console.log("getToken");
        return this.id.getToken();
    }

    toString() {
        console.log("Access toString");
        console.log(this.id);
        console.log(this.exp);
        if (this.id instanceof FunctionCall) { // hardcoding edge case for now
            console.log("case1");
            return this.id + "[" + this.exp + "]"; // for functions that return lists or objects
        } else {
            console.log("case2");
            if (this.exp instanceof AssignmentStatement) {
                return this.id + "[" + this.exp.target + "] = " + this.exp.source;
            } else {
                return this.id + "[" + this.exp + "]";
            }
        }
    }

    changeAccess() {
        // for some reason  !(this.exp instanceof StringLiteral) wasn't working
        // even though console logged this.exp and saw it was indeed a StringLiteral
        if (this.exp.type && !(this.exp.type.name !== 'stringlit')) {
            this.exp = new StringLiteral(this.exp.getToken());
            this.exp.string = '\'' + this.exp.string + '\'';
        }
        if (this.id instanceof Access) {
            this.id.changeAccess();
        }
    }

    analyze(context) {


        console.log("----------inside Access analyze----------");
        console.log(this.id);
 

        if (this.id instanceof Access) {
            this.id.changeAccess();
        }

        if (this.exp instanceof VariableReference && this.dot) {
            this.exp = new StringLiteral(this.exp.getToken());
            this.exp.string = '\'' + this.exp.string + '\'';
        }

        if (this.exp instanceof AssignmentStatement) {
            if (!(context.isVariable(this.exp.target.getToken()))) {
                this.exp.target = new StringLiteral(this.exp.target.getToken());
                this.exp.target.string = '\'' + this.exp.target.string + '\'';
            }
        }
        
        console.log("leaving Access analyze");
    }
}

module.exports = Access;