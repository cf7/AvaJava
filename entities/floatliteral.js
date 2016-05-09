var Type = require('./type.js');

var FloatLiteral = (function () {
    function FloatLiteral (value) {
        this.token = value;
        this.value = value.lexeme;
        this.type = Type.FLOAT;
    }

    FloatLiteral.prototype.getToken = function() {
        return this.token;
    };
    
    FloatLiteral.prototype.toString = function() {
        return '( ' + this.value + ' )';
    };
    
    FloatLiteral.prototype.analyze = function(context) {
        return this.type = Type.FLOAT;
    };

    FloatLiteral.prototype.optimize = function() {
        return this;
    };
    
    return FloatLiteral;
})();

module.exports = FloatLiteral;