var IntegerLiteral = (function () {
    function IntegerLiteral (value) {
        this.value = value;
    }

    IntegerLiteral.prototype.toString = function() {
        return '( ' + this.value + ' )';
    };
    
    IntegerLiteral.prototype.analyze = function(context) {
        console.log("--=--made it down to integers--=--");
        // add typechecking
    };

    return IntegerLiteral;
})();

module.exports = IntegerLiteral;