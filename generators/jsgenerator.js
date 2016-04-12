// baseline generator code from iki

var util = require('util');
var HashMap = require('hashmap').HashMap;
var map;
var lastId;

module.exports = function (program) {
  console.log("**********************GENERATOR********************");
  console.log(program);
  map = new HashMap();
  lastId = 0;
  return gen(program);
};

var indentPadding = 4;
var indentLevel = 0;

var emit = function (line) {
  var pad = indentPadding * indentLevel;
  return console.log(Array(pad + 1).join(' ') + line); // emits as soon as called, can't use recursion
};

var makeOp = function (op) {
  return {
    not: '!',
    and: '&&',
    or: '||',
    '==': '===',
    '!=': '!=='
  }[op] || op;
};

var makeVariable = function(v) {
  console.log(v);
  if (!map.has(v)) {
    map.set(v, ++lastId);
  }
  return '_v' + map.get(v);
};

var gen = function (e) {
  // console.log("inside gen: " + e.constructor.name);
  return generator[e.constructor.name](e); // find corresponding entity name in generator object
  // and pass in the entity into its matching function
};

var generator = {

  Program: function (program) {
    indentLevel = 0;
    emit('(() -> ');
    gen(program.block);
    return emit(');');
  },

  Block: function (block) {
    var i, len, ref, statement;
    var string = "";
    indentLevel++;
    ref = block.statements;
    for (i = 0, len = ref.length; i < len; i++) {
      statement = ref[i];
      // console.log("alksdjf;aljsdf  ---   " + statement.constructor.name);
      string = gen(statement); // this code currently emits from the inside to utilize indents and newlines
      // However, may be able to emit from the outside and simply make inside collecting strings
    }
    indentLevel--;
    return string;
  },

  VariableDeclaration: function (v) {
    // var initializer = { // typechecking?
    //   'int': '0',
    //   'bool': 'false'
    // }[v.type];
                        // change to just 'v' when analyzer is working
    return emit("var " + (makeVariable(v.lexeme)) + " = " + gen(v.exp) + ";"); //initializer + ";");
  },

  AssignmentStatement: function (s) {
    return emit((gen(s.target)) + " = " + (gen(s.source)) + ";");
  },

  Function: function (f) {
    return emit("function " + "( " + gen(f.args) + " )" + "{ " + gen(f.body) + " }");
  },

  Array: function (a) {
    var string = '[ ';
    string += gen(a[0]);
    for (var i = 1; i < a.length; i++) {
      string += ', ' + gen(a[i]);
    }
    string += ' ]';
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
      emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' } else ');
      emit(gen(ifelse.elseifs));

    } else if (ifelse.elseBody) {
      // console.log("inside else ........" + ifelse.elseBody.statements.constructor.name);
      emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' } ' + ' else { ' + gen(ifelse.elseBody) + ' }');

    } else {

      // console.log("inside no else");
      emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' }');

    }
    return;
  },

  ReturnStatement: function (r) {
    return emit('return ' + gen(r.value) + ';');
  },

  Print: function (p) {
    // console.log("inside Print: " + gen(p.expression));
    return "console.log(" + gen(p.expression) + ")";
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

  IntegerLiteral: function (literal) {
    return literal.toString(); // sometimes may not want to emit, just return a string
  },

  StringLiteral: function (literal) {
    // console.log("inside StringLiteral: " + literal.toString());
    return literal.toString();
  },

  // BooleanLiteral: function(literal) {
  //   return literal.toString();
  // },
  VariableReference: function(v) {
    return makeVariable(v.lexeme); // late pass in v.referrent once analyzer is working
  },
  // UnaryExpression: function(e) {
  //   return "(" + (makeOp(e.op.lexeme)) + " " + (gen(e.operand)) + ")";
  // },
  BinaryExpression: function(e) {
    return "(" + (gen(e.left)) + " " + (makeOp(e.operator.lexeme)) + " " + (gen(e.right)) + ")";
  }
};