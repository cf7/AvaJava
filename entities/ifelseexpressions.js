var IfElseStatements = (function () {
    function IfElseStatements(conditionalExp, body, elseifs, elseBody) {
        console.log("elseifs: " + elseifs[0]);
        this.conditional = conditionalExp;
        this.body = body || {};
        this.elseifs = elseifs || {};
        this.elseBody = elseBody || {};
    }

    IfElseStatements.prototype.toString = function() {
        // add elseifs!!!
        return '( if ' + '( ' + this.conditional + ' )' + ' then ' + (this.body) + ' else ' + (this.elseBody) + ' )';
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;