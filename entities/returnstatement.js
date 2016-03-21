var ReturnStatement = (function () {
    function ReturnStatement (value) {
        this.value = value;
    }

    ReturnStatement.prototype.toString = function() {
        return '( return ' + this.value + ' )';
    };
    
    return ReturnStatement;
})();

module.exports = ReturnStatement;