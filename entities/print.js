class Print {

    constructor(string) {
        this.string = string;
    }

    toString() {
        return "( " + "ava " + this.string + " )";
    }

    analyze(context) {
        return "2";
    }

    optimize() {
        return "2";
    }
}

module.exports = Print;