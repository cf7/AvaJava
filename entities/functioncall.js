var FunctionCall = (function () {
    function FunctionCall (id, params) {
        this.id = id;
        this.params = params;
    }

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.params.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        console.log(".........................al;kjdfl;asjdfkl;asjfkljaslkfjasl;jdf");
        for (var i = 0; i < this.params.length; i++) {
            if (this.params[i].kind === "id") {
                console.log("***lookingup***: " + this.params[i].lexeme);
                context.lookupVariable(this.params[i]);
            }
        }
    };

    return FunctionCall;
})();

module.exports = FunctionCall;