var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
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

var tokens = [];

var blockStatementKeywords = ['var', 'while', 'true', 'false', 'not', 
                            'for', 'if', 'ava', 'id', 'stringlit', 'intlit', 
                            'floatlit', 'boolit', '(', 'function',
                            'true', 'false', 'type', 'list', 'when', 'return'];
var assignmentOperators = ['=', '+=', '-=', '*=', '/='];

module.exports = function(scannerOutput) {
  tokens = scannerOutput;
  var program = parseProgram();
  match('EOF');
  return program;
};

var parseProgram = function() {
  return new Program(parseBlock());
};

var parseBlock = function() {
  var statements = [];
  var numberErrors = error.count;
  while (true) {
    statements.push(parseStatement());
    if (statements[0]) {
      match(';');
    }
    if ((!statements[0] && at(';'))) {
      while (at(';')) {
        match(';');
      }
    }
    if (!at(blockStatementKeywords)) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  return new Block(statements);
};

var parseStatement = function() {
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('ava')) {
    return parsePrintStatement();
  } else if (at('for')) {
    return parseForLoop();
  } else if (at('while')) {
    return parseWhileLoop();
  } else {
    return parseExpression();
  }
};

var parseVariableDeclaration = function() {
  var exp;
  match('var');
  var id = match('id');
  if (at('=')) {
    match('=');
    exp = parseExpression(); 
  }
  return new VariableDeclaration(id, exp);
};

var parseVariableReference = function () {
  var id = match('id');
  var op;
  if (at(['(', 'id', 'intlit', 'floalit', 'stringlit', 'boolit'])) { 
    return parseFunctionCall(id);
  } else if (at(assignmentOperators)) {
    op = match();
    return parseAssignmentStatement(op, id);
  } else {
    return new VariableReference(id);
  }

}

var parseType = function() {
  if (at(['int', 'float', 'bool', 'string', 'function', 'list'])) {
    return Type.forName(match().lexeme);
  } else {
    return error('Type expected', tokens[0]);
  }
};


var parseFunctionExp = function () {
  match('function');
  match('(');
  var params = parseParams();
  match(')');
  match('->');
  var body = parseFunctionBlock();
  return new Function(params, body);
}

var parseParams = function () {
  var exps = [];
  if (at('id')) {
    exps = parseTypedExpressionList();
  }
  return exps;
}

var parseTypedExpressionList = function () {
  var exps = [];
  exps.push(parseTypedExp());
  while (at(',')) {
    match(',');
    exps.push(parseTypedExp());
  }
  return exps;
}

var parseTypedExp = function () {
  var id = match('id');
  match(':');
  var type = parseType();
  return new TypedVariableDeclaration(id, type);
}

var parseExpList = function () {
  var exps = [];
  exps.push(parseExpression());
  while (at(',')) {
    match(',');
    exps.push(parseExpression());
  }
  return exps;
}

var parseFunctionBlock = function () {
  var statements = [];
  var numberErrors = error.count;
  while (!at('end')) {
    statements.push(parseStatement());
    match(';');
    if (!at(blockStatementKeywords)) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  match('end');
  return new Block(statements);
}

var parseFunctionCall = function (id) {
  var args = [];
  if (at('id')) {
    args.push(parseVariableReference());
  } else {
    if (at('(')) {
      match('(');
      args = args.concat(parseArgs());
      match(')');
    } else {
      while (!at([';', 'EOF'])) {
        args.push(parseExpression());
      }
    }
  }
  return new FunctionCall(id, args);
}

var parseArgs = function () {
  var exps = parseExpList();
  return exps;
}

var parseAssignmentStatement = function(op, id) {
  var target = new VariableReference(id);
  var source = parseExpression();
  return new AssignmentStatement(op, target, source);
};

var parsePrintStatement = function () {
  match('ava');
  var expression = parseExpression();
  return new Print(expression);
}

var parseForLoop = function () {
  var id;
  var counter;
  var exp;
  var body;
  match('for');
  if (at('each')) {
    match('each');
    if (!at('var')) {
      tokens.unshift({ kind: 'var', lexeme: 'var', line: tokens[0].line, col: tokens[0].col });
    }
    id = parseVariableDeclaration();
    match('in');
    exp = parseExpression();
    match('{');
    body = parseBlock();
    match('}');
  } else {
    if (at('(')) {
      match('(');
      id = parseVariableDeclaration();
      exp = parseConditionalExp();
      match(')');
      match('{');
      body = parseBlock();
      match('}');
    }
  }
  return new ForLoop(id, exp, body);
}

var parseWhileLoop = function () {
  match('while');
  match('(');
  var condition = parseExpression();
  match(')');
  match('{');
  var body = parseBlock();
  match('}');
  return new WhileLoop(condition, body);
}

var parseConditionalExp = function () {
  var conditionals = [];
  var bodies = [];
  var elseifs = [];
  var elseBody;
  var parentheses = false;
  while (at('if')) {
    match('if');
    if (at('(')) {
      match('(');
      parentheses = true;
    }
    conditionals.push(parseExp1());
    if (at(')') && !parentheses) {
      return error("Unbalanced parentheses", tokens[0]);
    } else if (at(')') && parentheses) {
      match(')');
    }
    match('then');
    bodies.push(parseBlock());
    if (at('else') && tokens[1].lexeme === 'if') {
      match('else');
    } else if (at('else')) {
      match('else');
      elseBody = parseBlock();
      break;
    }
  }
  match('end');
  return new IfElseStatements(conditionals, bodies, elseBody);
}

var parseExpression = function () {
  if (at('function')) {
    return parseFunctionExp();
  } else if (at('return')) {
    return parseReturnStatement();
  } else if (at('if')) {
    return parseConditionalExp();
  } else {
    return parseExp1();
  }
}

var parseExp1 = function () {
  var op, left, right;
  left = parseExp2();
  while (at('or')) {
    op = match('or');
    right = parseExp2();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp2 = function () {
  var op, left, right;
  left = parseExp3();
  while (at('and')) {
    op = match('and');
    right = parseExp3();
    left = new BinaryExpression(op, left, right);
  }
  if (at('both')) {
    match('both');
    right = parseExpression();
    left = new BothExpression(left, right);
  }
  return left;
}

var parseExp3 = function () {
  var op, left, right;
  left = parseExp4();
  if (at(['<', '>', '<=', '==', '>=', '!='])) {
    op = match();
    right = parseExp4();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp4 = function () {
  var op, left, right;
  left = parseExp5();
  while(at('@')){
    op = match('@');
    right = parseExp5();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp5 = function () {
  var op, left, right;
  left = parseExp6();
  while (at(['::'])) {
    op = match('::');
    right = parseExp6();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp6 = function () {
  var op, left, right;
  left = parseExp7();
  if (at('...')) {
    op = match();
    right = parseExp7();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp7 = function () {
  var op, left, right;
  left = parseExp8();
  while (at(['+', '-'])) {
    op = match();
    right = parseExp8();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp8 = function () {
  var op, left, right;
  left = parseExp9();
  while (at(['*', '/', '%'])) {
    op = match();
    right = parseExp9();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp9 = function () {
  var op, operand;
  if (at(['-', 'not'])) {
    op = match();
    operand = parseExp10();
    return new UnaryExpression(op, operand);
  } else {
    return parseExp10();
  }
}

var parseExp10 = function () {
  var op, operand;
  var operand = parseExp11();
  if (at(['++', '--'])) {
    op = match();
    return new PostfixExpression(op, operand);
  } else {
    return operand;
  }
}

var parseExp11 = function () {
  var op, left, right;
  left = parseExp12();
  while (at('^^')) {
    op = match();
    right = parseExp12();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp12 = function () {
  var id = parseExp13();
  if (at(['[', '.'])) {
    while (at(['[', '.'])) {
      while (at('[')) {
        match('[');
        id = new Access(id, false, parseExp13());
        match(']');
      }
      while (at('.')) {
        match('.');
        id = new Access(id, true, parseExp13());
      }
    }
    return id;
  } else {
    return id;
  }

}

var parseExp13 = function () {
  if (at('(')) {
    match('(');
    var exp = parseExpression();
    match(')');
    return exp;
  } else if (at('[')) {
    return parseList();
  } else if (at('{')) {
    return parseCollection();
  } else if (at('intlit')) {
    return parseIntegerLiteral();
  } else if (at('floatlit')) {
    return parseFloatLiteral();
  } else if (at('stringlit')) {
    return parseStringLiteral();
  } else if (at('id')) {  
    return varref = parseVariableReference();
  } else if (at(['true', 'false'])) {
    return parseBooleanLiteral();
  }
}

var parseList = function () {
  match('[');
  var exps = parseExpList();
  match(']');
  return new ListLiteral(exps);
}

var parseCollection = function () {
  var result;
  match('{');
  if (tokens[1].lexeme === ':') {
    result = parseObject();
  } else {
    result = parseSet();
  }
  match('}');
  return result;
}

var parseObjectExp = function () {
  var exp = {};
  var key = match().lexeme;
  match(':');
  var value = parseExpression();
  exp[key] = value;
  return exp
}

var parseObjectExpList = function () {
  var exps = parseObjectExp();
  while (at(',')) {
    match(',');
    Object.assign(exps, parseObjectExp());
  }
  return exps;
}

var parseObject = function () {
  var exps = parseObjectExpList();
  return new ObjectLiteral(exps);
}

var parseSet = function () {
  var exps = parseExpList();
  return new SetLiteral(exps);
}

var parseIntegerLiteral = function () {
  return new IntegerLiteral(match());
}

var parseFloatLiteral = function () {
  return new FloatLiteral(match());
}

var parseStringLiteral = function () {
  return new StringLiteral(match());
}

var parseBooleanLiteral = function () {
  return new BooleanLiteral(match());
}
var parseReturnStatement = function () {
  match('return');
  var exp = parseExpression();
  return new ReturnStatement(exp);
}

var at = function(kind) {
  if (tokens.length === 0) {
    return false;
  } else if (Array.isArray(kind)) {
    return kind.some(at);
  } else {
    return kind === tokens[0].kind;
  }
};

var match = function(kind) {
  if (tokens.length === 0) {
    return error('Unexpected end of source program');
  } else if (kind === void 0 || kind === tokens[0].kind) {
    return tokens.shift();
  } else {
    return error("Expected \"" + kind + "\" but found \"" + tokens[0].kind + "\"", tokens[0]);
  }
};