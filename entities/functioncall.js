var FunctionCall = (function () {
    function FunctionCall (id, args) {
        this.id = id;
        this.args = args;
    }

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.args.join(' ')) + ' )' + ' )';
    };
    return FunctionCall;
})();

module.exports = FunctionCall;