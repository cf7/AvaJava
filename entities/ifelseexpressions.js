var IfElseStatements = (function () {
    function IfElseStatements(conditionalExp, body, elseifs, elseBody) {
        this.conditional = conditionalExp;
        this.body = body;
        this.elseifs = elseifs;
        this.elseBody = elseBody;
    }

    IfElseStatements.prototype.toString = function() {
        // add elseifs!!!
        if (this.elseBody) {
            return '( if ' + '( ' + this.conditional + ' )' + ' then ' + (this.body) + ' else ' + (this.elseBody) + ' )';
        } else if (this.elseifs) {
            return '( if ' + '( ' + this.conditional + ' )' + ' then ' + (this.body) + ' else ' + (this.elseifs);
        } else {
            return '( if ' + '( ' + this.conditional + ' )' + ' then ' + (this.body) + ' )';
        }
    };

    IfElseStatements.prototype.analyze = function(context) {
        this.conditional.analyze(context);
        this.body.analyze(context);
        if (this.elseifs) {
            this.elseifs.analyze(context);
        }
        if (this.elseBody) {
            this.elseBody.analyze(context);
        }
    };
    
    IfElseStatements.prototype.optimize = function() {
        return this;
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;