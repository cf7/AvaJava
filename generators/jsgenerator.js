var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var Type = require('../entities/type.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
var Print = require('../entities/print.js');
var AssignmentStatement = require('../entities/assignmentstatement.js');
var IfElseStatements = require('../entities/ifelseexpressions.js');
var IntegerLiteral = require('../entities/integerliteral.js');
var FloatLiteral = require('../entities/floatliteral.js');
var SetLiteral = require('../entities/setliteral.js');
var ListLiteral = require('../entities/listliteral.js');
var BinaryExpression = require('../entities/binaryexpression.js');
var UnaryExpression = require('../entities/unaryexpression.js');
var PostfixExpression = require('../entities/postfixexpression.js');
var Function = require('../entities/function.js');
var FunctionCall = require('../entities/functioncall.js');
var ReturnStatement = require('../entities/returnstatement.js');
var StringLiteral = require('../entities/stringliteral.js');
var BooleanLiteral = require('../entities/booleanliteral.js');
var VariableReference = require('../entities/variablereference.js');
var BothExpression = require('../entities/bothexpression.js');
var ForLoop = require('../entities/forloop.js');
var WhileLoop = require('../entities/whileloop.js');

var util = require('util');
var HashMap = require('hashmap').HashMap;
var code = "";

// var map;
// var lastId;

module.exports = function (program) {
  console.log("**********************GENERATOR********************");
  console.log(program);
  map = new HashMap();
  lastId = 0;
  return generate(program);
};

var generate = function (program) {
  gen(program);
  return console.log(code);
}

var indentPadding = 4;
var indentLevel = 0;

var emit = function (line) {
  var pad = indentPadding * indentLevel;
  code += "\n" + Array(pad + 1).join(' ') + line;
};


var makeOp = function (op) { 
  return {    // only add to this list if Avajava operator looks different in javascript
    not: '!', 
    and: '&&',
    or: '||',
    '==': '===',
    '!=': '!=='
  }[op] || op;  // otherwise, if operators are same, keep op
};

// both work
var makeVariable = (function(lastId, map) {
  return function(v) {
    if (!map.has(v)) {
      map.set(v, ++lastId);
    }
    return '_v' + map.get(v);
  };
})(0, new HashMap());
// var makeVariable = function(v) { // if stops working, see original Iki version
//   console.log('inside makeVariable: ' + v);
//   console.log('map has ' + v + ': ' + map.has(v));
//   if (!map.has(v)) {
//     map.set(v, ++lastId);
//   }
//   return '_v' + map.get(v);
// };

var gen = function (e) {
  console.log("inside gen entity: " + e);
  console.log("inside gen constructor-name: " + e.constructor.name);
  console.log(e);
  return generator[e.constructor.name](e); // find corresponding entity name in generator object
  // and pass in the entity into its matching function
};

// consult entities for instance variables within
// the objects (example: program.block is an instance variable in the class Program)

// need to determine whether to use gen() or not
// sometimes will only need to return strings in the cases below
// can have a mix of calling entitiy toStrings() and calling gen() to keep traversing

var generator = {

  Program: function (program) {
    indentLevel = 0;
    emit('(function () {');
    emit(gen(program.block));
    return emit('})();');
  },

  Block: function (block) {
    var i, len, ref, statement, pad;
    var string = "";
    indentLevel++;
    ref = block.statements;
    if (ref[0]) {
      for (i = 0, len = ref.length; i < len; i++) {
        statement = ref[i];
        console.log("inside Block for loop: " + statement);
        pad = indentPadding * indentLevel;
        string += "\n" + Array(pad + 1).join(' ') + gen(statement);
        // }
      }
    indentLevel--;
    }
    return string;
  },

  VariableDeclaration: function (v) {
    // var initializer = { // typechecking?
    //   'int': '0',
    //   'bool': 'false'
    // }[v.type];
    if (v.exp) {
                    // change to just 'v' when analyzer is working
      return "var " + (makeVariable(v.id.lexeme)) + " = " + gen(v.exp) + ";" //initializer + ";");
    } else {
      return "var " + (makeVariable(v.id.lexeme)) + ";";
    }
  },

  ListAccess: function (l) {
      var string = "";
      string += gen(l.exps[0]);
      if (l.exps.length > 1) {
        for (var i = 1; i < l.exps.length; i++) {
          string += "][" + gen(l.exps[i]);
        }
      }
      return gen(l.id) + "[" + string + "]";
  },

  TypedVariableDeclaration: function (t) {
    return makeVariable(t.id.lexeme);
  },

  AssignmentStatement: function (s) {
    return (gen(s.target)) + " " + makeOp(s.operator.lexeme) + " " + (gen(s.source)) + ";";
  },

  Function: function (f) {
    console.log("params length: " + f.params.length);
    if (f.params.indexOf(undefined) === -1 && f.params.length > 0) {
      return "function " + "( " + gen(f.params) + " )" + "{ " + gen(f.body) + " }";
    } else {
      return "function " + "() { " + gen(f.body) + " }";
    }
  },

  Array: function (a) {
    var string = "";
    if (a.length > 1) {
      // string += '[ ';
      string += gen(a[0]);
      for (var i = 1; i < a.length; i++) {
        string += ', ' + gen(a[i]);
      }
      // string += ' ]';
    } else {
      string += gen(a[0]);
    }
    return string;
  },

  // if getting numbers from gen() while generating a block, might
  // be because block returns indentlevel
  IfElseStatements: function (ifelse) {
    // can still use gen() without using emit(), use gen() to traverse
    // gen() allows recursion from outside this function! 
    // allows it to leave and come back
    // basically use generator['key'](input) to get same effect
    if (ifelse.elseifs) {
      // console.log("inside elseifs ......" + ifelse.elseifs);
      // console.log("alsdkjas;lj ===== " + "console.log(" + gen(ifelse.body) + ")");
      return 'if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' } else ' + gen(ifelse.elseifs);

    } else if (ifelse.elseBody) {
      // console.log("inside else ........" + ifelse.elseBody.statements.constructor.name);
      return 'if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' } ' + ' else { ' + gen(ifelse.elseBody) + ' }';

    } else {

      // console.log("inside no else");
      return 'if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' }';

    }
  },

  ReturnStatement: function (r) {
    return 'return ' + gen(r.value) + ';';
  },

  Print: function (p) {
    // console.log("inside Print: " + gen(p.expression));
    return "console.log(" + gen(p.expression) + ")";
  },

  FunctionCall: function (c) {
    console.log("inside FunctionCall: " + c.id.lexeme);
    if (c.args.length > 0 && c.args[0]) {
      return makeVariable(c.id.lexeme) + "(" + gen(c.args) + ")";
    } else {
      return makeVariable(c.id.lexeme) + "()";
    }
  },

  WhileLoop: function (w) {
    return 'while (' + gen(w.condition) + ') { ' + gen(w.body) + ' }';
  },

  ForLoop: function (f) {
    var index = { kind: 'id', lexeme: 'i' };
    var indexExp = { kind: 'intlit', lexeme: '0' };
    var op = { kind: '<', lexeme: '<' };
    var left = new VariableReference(index); // don't gen() these because will
    // be passed into gen() later on (in BinaryExpression)
    var right = f.exp; // this is also a VariableReference
    var incrementOp = { kind: '++', lexeme: '++' };
    var operand = new VariableReference(index);

    if (!f.id) {
        console.log("inside ForLoop: " + f);
        // "for (var i = 0; i < gen(f.exp); i++) { gen(f.body) }"
        return 'for (' + gen(new VariableDeclaration(index, new IntegerLiteral(indexExp)))
          + ' ' + gen(new BinaryExpression(op, left, right)) + '; '
          +  gen(new PostfixExpression(incrementOp, operand)) + ') { ' 
          + gen(f.body) + ' }';
    } else {
        console.log("inside ForLoop: " + f.id);
        return 'for (' + gen(f.id).replace(';','') + ' of ' + gen(f.exp) + ') { ' + gen(f.body) + ' }';
    }
  },

  PostfixExpression: function (pfx) {
    return gen(pfx.operand) + makeOp(pfx.operator.lexeme);
  },

  BothExpression: function (both) {
    // has a left and right, left is binaryExpression, right is an Expression
    // binaryExpressions have operators
    var right = both.right;
    if (right instanceof UnaryExpression) {
      right = gen(both.right);
      return "( " + gen(both.left.left) + " !== " + right.replace('!', '') + ' ' + makeOp(both.left.operator.lexeme) + ' ' + gen(both.left.right) + " !== " + right.replace('!', '') + " )";
    } else {
      right = gen(both.right);
      return "( " + gen(both.left.left) + " === " + right + ' ' + makeOp(both.left.operator.lexeme) + ' ' + gen(both.left.right) + " === " + right + " )";
    }
  },

  // ReadStatement: function(s) {
  //   var i, len, ref, results, v;
  //   ref = s.varrefs;
  //   results = [];
  //   for (i = 0, len = ref.length; i < len; i++) {
  //     v = ref[i];
  //     results.push(emit((makeVariable(v.referent)) + " = prompt();"));
  //   }
  //   return results;
  // },
  // WriteStatement: function(s) {
  //   var e, i, len, ref, results;
  //   ref = s.expressions;
  //   results = [];
  //   for (i = 0, len = ref.length; i < len; i++) {
  //     e = ref[i];
  //     results.push(emit("alert(" + (gen(e)) + ");"));
  //   }
  //   return results;
  // },
  // WhileStatement: function(s) {
  //   emit("while (" + (gen(s.condition)) + ") {");
  //   gen(s.body);
  //   return emit('}');
  // },

  BooleanLiteral: function (literal) {
    return literal.toString();
  },

  IntegerLiteral: function (literal) {
    return literal.toString(); // sometimes may not want to emit, just return a string
  },

  FloatLiteral: function (literal) {
    return literal.toString();
  },

  StringLiteral: function (literal) {
    // console.log("inside StringLiteral: " + literal.toString());
    return literal.toString();
  },

  SetLiteral: function (literal) {
    return "new Set([" + literal.values.join(',') + "])";
  },

  ListLiteral: function (literal) {
    return literal.toString();
  },

  // BooleanLiteral: function(literal) {
  //   return literal.toString();
  // },

  VariableReference: function(v) {
    console.log("inside VariableReference: " + v.token.lexeme);
    return makeVariable(v.token.lexeme); // later pass in v.referent once analyzer is working
  },

  UnaryExpression: function(e) {
    return "(" + (makeOp(e.operator.lexeme)) + (gen(e.operand)) + ")";
  },

  BinaryExpression: function(e) { // turn string manipulation stuff into function later
    console.log("inside BinaryExpression: " + e.operator.lexeme);
    if (e.operator.lexeme === '^^') {
      return "( Math.pow(" + gen(e.left) + ", " + gen(e.right) + ") )";
    } else if (e.left instanceof StringLiteral && e.right instanceof StringLiteral) {
      if (e.operator.lexeme === '-') {
        return "( " + gen(e.left) + ".replace(" + gen(e.right) + ", '') )";
      } else {
        return "( " + gen(e.left) + " " + makeOp(e.operator.lexeme) + " " + gen(e.right) + " )";
      }
    } else if (e.left instanceof StringLiteral && e.right instanceof IntegerLiteral) {
      if (e.operator.lexeme === '*') {
        return "( " + gen(e.left) + ".repeat(" + gen(e.right) + ") )";
      }
    } else if (e.left instanceof IntegerLiteral && e.right instanceof StringLiteral) {
      if (e.operator.lexeme === '*') {
        return "( " + gen(e.right) + ".repeat(" + gen(e.left) + ") )";
      }
    } else {
      return "(" + (gen(e.left)) + " " + (makeOp(e.operator.lexeme)) + " " + (gen(e.right)) + ")";
    }
  }
};