var Type = require('./type.js');

var IntegerLiteral = (function () {
    function IntegerLiteral (value) {
        this.token = value;
        this.value = value.lexeme;
        this.type = Type.INT;
    }

    IntegerLiteral.prototype.getToken = function() {
        return this.token;
    };

    IntegerLiteral.prototype.toString = function() {
        return '( ' + this.value + ' )';
    };
    
    IntegerLiteral.prototype.analyze = function(context) {
        return this.type = Type.INT;
    };

    IntegerLiteral.prototype.optimize = function() {
        return this;
    };
    
    return IntegerLiteral;
})();

module.exports = IntegerLiteral;