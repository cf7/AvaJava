var Type = require('./type.js');

var StringLiteral = (function () {

    function StringLiteral (string) {
        this.token = string;
        this.string = string.lexeme;
        this.type = Type.STRING;
    }

    StringLiteral.prototype.getToken = function() {
        return this.token;
    };

    StringLiteral.prototype.toString = function() {
        return '( ' + this.string + ' )';
    };

    StringLiteral.prototype.analyze = function(context) {
        return this.type = Type.STRING;
    };

    StringLiteral.prototype.optimize = function() {
        return this;
    };

    return StringLiteral;
})();

module.exports = StringLiteral;