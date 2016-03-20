IntegerLiteral = (function () {
    function IntegerLiteral (value) {
        this.value = value;
    }

    IntegerLiteral.prototype.toString = function() {
        return '( ' + this.value.lexeme + ' )';
    };
    
    return IntegerLiteral;
})();

module.exports = IntegerLiteral;