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
            strings.push('else ' + this.bodies[this.bodies.length - 1]);
        }
        return strings.join('');
    };

    IfElseStatements.prototype.analyze = function(context) {
        // for (conditional of this.conditionals) {
        //     conditional.analyze(context);
        // }
        // // this.conditionals.analyze(context);
        // for (body of this.bodies) {
        //     body.analyze(context);
        // }
        // // this.bodies.analyze(context);
        // if (this.elseBody) {
        //     this.elseBody.analyze(context);
        // }
    };
    
    IfElseStatements.prototype.optimize = function() {
        return this;
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;