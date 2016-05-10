var BooleanLiteral = require('./booleanliteral.js');
var StringLiteral = require('./stringliteral.js');

var IfElseStatements = (function () {
    function IfElseStatements(conditionals, bodies, elseBody) {
        this.conditionals = conditionals;
        this.bodies = bodies;
        this.elseBody = elseBody;
    }

    IfElseStatements.prototype.toString = function() {
        var strings = [];
        strings.push('( if ' + '( ' + this.conditionals[0] + ' )' + ' then ' + (this.bodies[0]) + ' )');
        if (this.conditionals.length > 1) {
            for (var i = 1; i < this.conditionals.length; i++) {
                strings.push('else if ( ' + this.conditionals[i] + ' ) then ' + this.bodies[i]);
            }
        }
        if (this.elseBody) {
            strings.push('else ' + this.elseBody);
        }
        return strings.join('');
    };

    IfElseStatements.prototype.analyze = function(context) {
        for (var i = 0; i < this.conditionals.length; i++) {
            this.conditionals[i].analyze(context);
        }

        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].analyze(context);
        }

        if (this.elseBody) {
            this.elseBody.analyze(context);
        }
    };
    
    IfElseStatements.prototype.optimize = function() {
        var unreachableIndices = [];
        for (var i = 0; i < this.conditionals.length; i++) {
            this.conditionals[i] = this.conditionals[i].optimize();
            if (this.conditionals[i] instanceof BooleanLiteral) {
                if (this.conditionals[i].name === 'false') {
                    unreachableIndices.push(i);
                }
            }
        }
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i] = this.bodies[i].optimize();
        }

        for (var i = 0; i < this.conditionals.length; i++) {
            for (var j = 0; j < unreachableIndices.length; j++) {
                if (i === unreachableIndices[j]) {
                    this.conditionals = this.conditionals.slice(0, i);
                    this.conditionals = this.conditionals.concat(this.conditionals.slice(i+1, this.conditionals.length));
                    this.bodies = this.bodies.slice(0, i);
                    this.bodies = this.bodies.concat(this.bodies.slice(i+1, this.bodies.length));
                }
            }
        }

        if (this.elseBody) {
            this.elseBody = this.elseBody.optimize();
        }
        
        // if (this.conditionals.length === 1 && this.conditionals[0].name === 'false') {
        //     return this.elseBody;
        // } else {
        //     return this;
        // }
        return this;
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;