var Type = require('./type.js');

var IntegerLiteral = (function () {
    function IntegerLiteral (value) {
        this.value = value;
        this.type = Type.INT;
    }

    IntegerLiteral.prototype.toString = function() {
        return '( ' + this.value + ' )';
    };
    
    IntegerLiteral.prototype.analyze = function(context) {
        console.log("--=--made it down to integers--=--");
        // add typechecking
        return this.type = Type.INT;
    };

    return IntegerLiteral;
})();

module.exports = IntegerLiteral;