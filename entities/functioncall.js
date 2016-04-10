var FunctionCall = (function () {
    function FunctionCall (id, params) {
        this.id = id;
        this.params = params;
    }

    // need to be able to get token to lookupvariable
    FunctionCall.prototype.getToken = function() {
        return this.id;
    };

    FunctionCall.prototype.toString = function() {
        return '( ' + this.id.lexeme + ' ( ' + (this.params.join(' ')) + ' )' + ' )';
    };

    FunctionCall.prototype.analyze = function(context) {
        console.log(".........................al;kjdfl;asjdfkl;asjfkljaslkfjasl;jdf");
        console.log(this.params);
        for (var i = 0; i < this.params.length; i++) {
            if (this.params[i].getToken().kind === "id") {
                console.log("***lookingup***: " + this.params[i].getToken().lexeme);
                context.lookupVariable(this.params[i].getToken());
            }
        }
    };

    return FunctionCall;
})();

module.exports = FunctionCall;