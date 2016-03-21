Function = (function () {
    function Function (args, body) {
        this.args = args;
        this.body = body;
    }

    Function.prototype.toString = function() {
        return '( args' + this.args.join(' ') + '( ' + this.body + ' )' + ' )';
    };
    return Function;
})();

module.exports = Function;