"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var ObjectLiteral = require('./objectliteral.js');
var StringLiteral = require('./stringLiteral.js');
var FloatLiteral = require('./floatliteral.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var BuiltIns = require('./builtins.js');
var AssignmentStatement = require('./assignmentstatement.js');
var error = require('../error.js');

var keywords = ['var', 'while', 'true', 'false', 'not', 
                'for', 'if', 'ava', 'string', 'int', 
                'float', 'bool', '(', 'function',
                'true', 'false', 'list', 'return', 'object', 'set'];

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
        if (!this.exp) {
            error("Accessing requires an expression", this.exp);
        } else if (this.exp instanceof FloatLiteral) {
            error("Cannot use floats to index an array", this.exp);
        } else if (this.exp) {
            var token = this.exp.getToken();
            if (keywords.some(function (word) { return token.lexeme === word })) {
                error("Access index cannot be a keyword", this.exp);
            }
        }

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

        if (this.exp instanceof FunctionCall && this.dot) {
            error("Incorrect syntax for calling functions", this);
        }
    }

    optimize() {
        this.id = this.id.optimize();
        this.exp = this.exp.optimize();
        return this;
    }
}

module.exports = Access;