// baseline code from Iki
"use strict";

var ReturnStatement = require('./returnstatement.js');

var Block = (function() {
  function Block(statements) {
    this.statements = statements;
  }

  Block.prototype.toString = function() {
    return "(Block " + (this.statements.join(' ')) + ")";
  };

  Block.prototype.analyze = function(context) {
    console.log("inside Block analyze");
    var i, len, localContext, ref, results, statement;
    localContext = context.getInsideFunction() ? context : context.createChildContext(); // create new local context for this block
    // only if it not inside a function
    console.log("parentContext: ");
    console.log(localContext.parent.symbolTable);
    console.log("localContext: ");
    console.log(localContext.symbolTable);
    console.log("statements: " + this.statements);
    ref = this.statements;
    results = [];
    if (ref[0]) {
      for (i = 0, len = ref.length; i < len; i++) {
        statement = ref[i];
        console.log("Block CURRENT STATEMENT: " + statement);
        results.push(statement.analyze(localContext));
      }
      console.log("Block: results . . . " + results);
    }
    console.log("leaving Block analyze");
    return results;
  };

  Block.prototype.optimize = function() {
    console.log("inside Block optimize");

    // unreachable code removal for return statements
    var temporary = [];
    var extraneous = false;
    for (var i = 0; i < this.statements.length; i += 1) {
      console.log(this.statements[i]);
      if (this.statements[i] instanceof ReturnStatement) {
        temporary = this.statements.slice(0, i + 1);
        console.log(temporary);
        extraneous = true;
      }
    }
    if (extraneous) {
      this.statements = temporary.slice();
      console.log(this.statements);
    }

    var s;
    this.statements = (function() {
      var ref = this.statements;
      var results = [];
      for (var i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        results.push(s.optimize());
      }
      return results;
    }).call(this);
    this.statements = (function() {
      var ref = this.statements;
      var results = [];
      for (var i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (s !== null) {
          results.push(s);
        }
      }
      return results;
    }).call(this);
    return this;
  };

  return Block;

})();

module.exports = Block;