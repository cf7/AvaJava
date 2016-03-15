class Print {

    constructor(expression) {
        this.expression = expression;
    }

    toString() {
        return "( " + "ava " + this.expression + " )";
    }

    analyze(context) {
        return "2";
    }

    optimize() {
        return "2";
    }
}

module.exports = Print;