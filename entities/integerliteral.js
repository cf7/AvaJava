var IntegerLiteral = (function () {
    function IntegerLiteral (value) {
        this.value = value;
    }

    IntegerLiteral.prototype.toString = function() {
        return '( ' + this.value.lexeme + ' )';
    };
    
    IntegerLiteral.prototype.analyze = function(context) {
        console.log("--=--made it down to integers--=--");
    };
    return IntegerLiteral;
})();

module.exports = IntegerLiteral;