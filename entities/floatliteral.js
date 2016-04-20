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
        console.log("--=--made it down to floats--=--");
        // add typechecking
        // will definitely need typechecking to support
        // operations between integers and doubles (floats)
        // don't need to execute, just need to translate
        return this.type = Type.FLOAT;
    };

    return FloatLiteral;
})();

module.exports = FloatLiteral;