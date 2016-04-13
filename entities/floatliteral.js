var FloatLiteral = (function () {
    function FloatLiteral (value) {
        this.value = value;
    }

    FloatLiteral.prototype.toString = function() {
        return '( ' + this.value + ' )';
    };
    
    FloatLiteral.prototype.analyze = function(context) {
        console.log("--=--made it down to floats--=--");
        // add typechecking
    };

    return FloatLiteral;
})();

module.exports = FloatLiteral;