var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var BuiltIns = require('../entities/builtins.js');
var Type = require('../entities/type.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
var TypedVariableDeclaration = require('../entities/typedvariabledeclaration.js');
var Print = require('../entities/print.js');
var AssignmentStatement = require('../entities/assignmentstatement.js');
var IfElseStatements = require('../entities/ifelseexpressions.js');
var IntegerLiteral = require('../entities/integerliteral.js');
var FloatLiteral = require('../entities/floatliteral.js');
var ObjectLiteral = require('../entities/objectliteral.js');
var SetLiteral = require('../entities/setliteral.js');
var ListLiteral = require('../entities/listliteral.js');
var Access = require('../entities/access.js');
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
var counter = 0;
var builtins = new BuiltIns();

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

var gen = function (e) {
  return generator[e.constructor.name](e);
};

var hasStatement = function (array) {
  var hasStmt = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
      hasStmt = true;
    }
  }
  return hasStmt;
}

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
    if (hasStatement(ref)) {
      for (i = 0, len = ref.length; i < len; i++) {
        statement = ref[i];
        if (statement) {
          console.log("inside Block for loop: " + statement);
          pad = indentPadding * indentLevel;
          string += "\n" + Array(pad + 1).join(' ') + gen(statement);
        }
      }
    indentLevel--;
    }
    return string;
  },

  VariableDeclaration: function (v) {
    if (v.exp) {
      return "var " + (makeVariable(v.id.lexeme)) + " = " + gen(v.exp);
    } else {
      return "var " + (makeVariable(v.id.lexeme));
    }
  },

  Access: function (l) {
    console.log("inside Access generate");
    console.log(l.id);
    if (l.exp instanceof AssignmentStatement) {
      return gen(l.id) + '[' + gen(l.exp.target) + '] = ' + gen(l.exp.source);
    } else {
      return gen(l.id) + '[' + gen(l.exp) + ']';
    }
  },

  ObjectAccess: function (o) {
    console.log("inside ObjectAccess generate");
    console.log(o.id);
    console.log(o.exps);
    console.log(o.exps[0]);

    return gen(o.id) + '.' + gen(o.exps[0]);
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

  IfElseStatements: function (ifelse) {
    var strings = [];
    strings.push('if' + '(' + gen(ifelse.conditionals[0]) + ')' + ' { '+ gen(ifelse.bodies[0]) + ' }');
    if (ifelse.conditionals.length > 1) {
        for (var i = 1; i < ifelse.conditionals.length; i++) {
            strings.push('else if ( ' + gen(ifelse.conditionals[i]) + ' ) { ' + gen(ifelse.bodies[i]) + ' } ');
        }
    }
    if (ifelse.elseBody) {
        strings.push(' else { ' + gen(ifelse.elseBody) + ' } ');
    }
    return strings.join('');
  },

  ReturnStatement: function (r) {
    return 'return ' + gen(r.value) + ';';
  },

  Print: function (p) {
    // return "console.log(" + gen(p.expression) + ")";
  },

  FunctionCall: function (c) {
    console.log("inside FunctionCall: " + c.id.lexeme);
    console.log(builtins);
    if (builtins.entities[c.id.lexeme]) {
      if (c.args.length > 0 && c.args[0]) {
        console.log("insideinsideinsideinsideinsideinsideinsideinside");
        console.log(c.id.lexeme);
        var newArgs = c.args.map(gen);
        return builtins.entities[c.id.lexeme].generateCode(newArgs);
      } else {
        console.log("inhereinhereinhereinhereinhereinhereinhereinhere");
        console.log(c.id.lexeme);
        return builtins.entities[c.id.lexeme].generateCode();
      }
    } else {
      if (c.args.length > 0 && c.args[0]) {
        return makeVariable(c.id.lexeme) + "(" + gen(c.args) + ")";
      } else {
        return makeVariable(c.id.lexeme) + "()";
      }
    }
  },

  WhileLoop: function (w) {
    return 'while (' + gen(w.condition) + ') { ' + gen(w.body) + ' }';
  },

  ForLoop: function (f) {
    var index = { kind: 'id', lexeme: 'i' };
    var indexExp = { kind: 'intlit', lexeme: '0' };
    var op = { kind: '<', lexeme: '<' };
    var left = new VariableReference(index); 
    var right = f.exp;
    var incrementOp = { kind: '++', lexeme: '++' };
    var operand = new VariableReference(index);
    
    if (f.exp instanceof IfElseStatements) {
        return 'for (' + gen(new VariableDeclaration(index, new IntegerLiteral(indexExp)))
          + '; ' + gen(f.exp.conditionals[0]) + '; ' + gen(f.exp.bodies[0]) + ') { '
          + gen(f.body) + ' }';
    } else {
        console.log("inside ForLoop: " + f.id);
        // just need the variable name
        var iterator = gen(f.id).replace('var', '').replace('=', '').replace('(', '')
                                .replace(')', '').replace('0', '').replace(';', '');
        return 'for (' + iterator + ' of ' + gen(f.exp) + ') { ' + gen(f.body) + ' }';
    }
  },

  PostfixExpression: function (pfx) {
    return gen(pfx.operand) + makeOp(pfx.operator.lexeme);
  },

  BothExpression: function (both) {
    var right = both.right;
    if (right instanceof UnaryExpression) {
      right = gen(both.right);
      return "( " + gen(both.left.left) + " !== " + right.replace('!', '') + ' ' + makeOp(both.left.operator.lexeme) + ' ' + gen(both.left.right) + " !== " + right.replace('!', '') + " )";
    } else {
      right = gen(both.right);
      return "( " + gen(both.left.left) + " === " + right + ' ' + makeOp(both.left.operator.lexeme) + ' ' + gen(both.left.right) + " === " + right + " )";
    }
  },

  BooleanLiteral: function (literal) {
    return literal.toString();
  },

  IntegerLiteral: function (literal) {
    return literal.toString();
  },

  FloatLiteral: function (literal) {
    return literal.toString();
  },

  StringLiteral: function (literal) {
    return literal.toString();
  },

  ObjectLiteral: function (literal) {
    return literal.toString();
  },

  SetLiteral: function (literal) {
    return "new Set([" + gen(literal.values) + "])";
  },

  ListLiteral: function (literal) {
    if (literal.elements[0] && (literal.elements[0] instanceof BinaryExpression)) {
      return gen(literal.elements[0]);
    } else {
      return literal.toString();
    }
  },

  VariableReference: function(v) {
    console.log("inside VariableReference: " + v.token.lexeme);
    return makeVariable(v.token.lexeme);
  },

  UnaryExpression: function(e) {
    return "(" + (makeOp(e.operator.lexeme)) + (gen(e.operand)) + ")";
  },

  BinaryExpression: function(e) {
    console.log("inside BinaryExpression: " + e.operator.lexeme);
    
    if (e.operator.lexeme === '...') {
      var minus = {kind: '-', lexeme: '-', line: 0, col: 0};
      var plus = {kind: '+', lexeme: '+', line: 0, col: 0};
      var one = {kind: 'intlit', lexeme: '1', line: 0, col: 0};
      var difference = new BinaryExpression(minus, e.right, e.left);
      var index = new BinaryExpression(plus, difference, new IntegerLiteral(one));
      return 'Array.from(new Array(' + gen(index) + '), (x,i) => i + ' + gen(e.left) + ')';
    } else if (e.operator.lexeme === '^^') {
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
    } else if( e.operator.lexeme === '@') {
        return gen(e.left) + '.concat(' + gen(e.right) + ')';
    } else if (e.operator.lexeme === '::'){
      if(e.left instanceof IntegerLiteral && e.right instanceof IntegerLiteral){
        return '[' + gen(e.left) + ', ' + gen(e.right) + ']';
      } else if(e.left instanceof ListLiteral && e.right instanceof IntegerLiteral){
        return gen(e.left) + ".concat(" + gen(e.right) + ")";
      } else if(e.left instanceof IntegerLiteral && e.right instanceof ListLiteral){
        return "[" + gen(e.left)  + "]" + ".concat(" + gen(e.right) + ")";
      } else if(e.left instanceof ListLiteral && e.right instanceof ListLiteral) {
        return '[' + gen(e.left) + '].concat(' + gen(e.right) + ')';
      }else{
       return gen(e.left)  + ".concat(" + gen(e.right) + ")" 
      }
    } else {
      return "(" + (gen(e.left)) + " " + (makeOp(e.operator.lexeme)) + " " + (gen(e.right)) + ")";
    }
  }
};