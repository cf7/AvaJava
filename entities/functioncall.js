var FunctionCall = (function () {
    function FunctionCall (id, params) {
        this.id = id;
        this.params = params;
    }

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.params.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        
    };

    return FunctionCall;
})();

module.exports = FunctionCall;