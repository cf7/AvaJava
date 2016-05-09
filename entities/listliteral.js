"use strict";

var Type = require('./type.js');
var error = require('../error.js');

class ListLiteral {
    constructor(elements) {
        this.elements = elements;
        this.type = Type.LIST;
    }

    getToken() {
        return {};
    }
    
    toString() {
        return "[" + this.elements.join(',') + "]";
    }

    analyze(context) {
        if (this.elements[0]) {
            for (var i = 0; i < this.elements.length; i += 1) {
                this.elements[i].analyze(context);
            }
            var firstElement = this.elements[0];
            for (var i = 0; i < this.elements.length; i += 1) {
                if (firstElement.type !== this.elements[i].type) {
                    error("Elements in list must all be of the same type", this);
                }
            }
        }
        return this;
    }

    optimize() {

    }
}

module.exports = ListLiteral;