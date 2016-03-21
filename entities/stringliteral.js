var StringLiteral = (function () {

    function StringLiteral (string) {
        this.string = string;
    }

    StringLiteral.prototype.toString = function() {
        return '( ' + this.string.lexeme + ' )';
    };

    return StringLiteral;
})();

module.exports = StringLiteral;