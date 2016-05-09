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
        return this.id.getToken();
    }

    toString() {
        if (this.id instanceof FunctionCall) {
            return this.id + "[" + this.exp + "]";
        } else {
            if (this.exp instanceof AssignmentStatement) {
                return this.id + "[" + this.exp.target + "] = " + this.exp.source;
            } else {
                return this.id + "[" + this.exp + "]";
            }
        }
    }

    changeAccess() {
        if (!(this.exp instanceof StringLiteral)) {
            this.exp = new StringLiteral(this.exp.getToken());
            this.exp.string = '\'' + this.exp.string + '\'';
        }
        if (this.id instanceof Access) {
            this.id.changeAccess();
        }
    }

    analyze(context) {

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
    }

    optimize() {
        this.id = this.id.optimize();
        this.exp = this.exp.optimize();
        return this;
    }
}

module.exports = Access;