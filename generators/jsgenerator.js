// baseline generator code from iki

var util = require('util');
var HashMap = require('hashmap').HashMap;

module.exports = function(program) {
  console.log("**********************GENERATOR********************");
  console.log(program);
  return gen(program);
};

var indentPadding = 4;
var indentLevel = 0;

var emit = function(line) {
  var pad = indentPadding * indentLevel;
  return console.log(Array(pad + 1).join(' ') + line);
};

var makeOp = function(op) {
  return {
    not: '!',
    and: '&&',
    or: '||',
    '==': '===',
    '!=': '!=='
  }[op] || op;
};

var makeVariable = (function(lastId, map) {
  return function(v) {
    if (!map.has(v)) {
      map.set(v, ++lastId);
    }
    return '_v' + map.get(v);
  };
})(0, new HashMap());

var gen = function(e) {
  console.log("inside gen: " + e.constructor.name);
  return generator[e.constructor.name](e);
};

var generator = {

  Program: function(program) {
    indentLevel = 0;
    emit('(() -> ');
    gen(program.block);
    return emit(');');
  },

  Block: function(block) {
    var i, len, ref, statement;
    indentLevel++;
    ref = block.statements;
    for (i = 0, len = ref.length; i < len; i++) {
      statement = ref[i];
      gen(statement);
    }
    return indentLevel--;
  },

  VariableDeclaration: function(v) {
    // var initializer = { // typechecking?
    //   'int': '0',
    //   'bool': 'false'
    // }[v.type];
    return emit("var " + (makeVariable(v)) + " = " + gen(v.exp) + ";"); //initializer + ";");
  },

  AssignmentStatement: function(s) {
    return emit((gen(s.target)) + " = " + (gen(s.source)) + ";");
  },

  Function: function (f) {
    return emit("function " + "( " + gen(f.args) + " )" + "{ " + gen(f.body) + " }");
  },

  Array: function (a) {
    var string = "";
    for (var i = 0; i < a.length; i++) {
      string += emit(gen(a[i]));
    }
    return string;
  },

  IfElseStatements: function (ifelse) {
    if (ifelse.elseifs) {
      console.log("inside elseifs");
      return emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' }');
    } else if (ifelse.elseBody) {
      console.log("inside else");
      return emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body) + ' } ' + ' else { ' + gen(ifelse.elseBody) + ' }');
    } else {
      console.log("inside no else");
      return emit('if (' + gen(ifelse.conditional) + ' )' + ' { ' + gen(ifelse.body));
    }
  },

  ReturnStatement: function (r) {
    return emit('return ' + gen(r.value) + ';');
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
  IntegerLiteral: function(literal) {
    return literal.toString();
  },
  // BooleanLiteral: function(literal) {
  //   return literal.toString();
  // },
  VariableReference: function(v) {
    return makeVariable(v.referent);
  },
  // UnaryExpression: function(e) {
  //   return "(" + (makeOp(e.op.lexeme)) + " " + (gen(e.operand)) + ")";
  // },
  BinaryExpression: function(e) {
    return "(" + (gen(e.left)) + " " + (makeOp(e.operator.lexeme)) + " " + (gen(e.right)) + ")";
  }
};