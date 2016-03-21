var IfElseStatements = (function () {
    function IfElseStatements(conditionalExp, body, elseifs, elseBody) {
        this.conditional = conditionalExp;
        this.body = body || {};
        this.elseifs = elseifs || {};
        this.elseBody = elseBody || {};
    }

    IfElseStatements.prototype.toString = function() {
        return '( if ' + '( ' + this.conditional + ' )' + ' then ' + (this.body) + ' else ' + (this.elseifs) + ' )';
        // add elseBody
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;