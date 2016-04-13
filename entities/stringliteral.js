var StringLiteral = (function () {

    function StringLiteral (string) {
        this.string = string;
    }

    StringLiteral.prototype.toString = function() {
        return '( ' + this.string + ' )';
    };

    StringLiteral.prototype.analyze = function(context) {
        // do something with the string and context
        console.log("---=---made it down to strings---=---");
        // add typechecking
    };

    return StringLiteral;
})();

module.exports = StringLiteral;