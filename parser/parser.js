var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var Type = require('../entities/type.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
// var AssignmentStatement = require('./entities/assignmentstatement');
// var ReadStatement = require('./entities/readstatement');
// var WriteStatement = require('./entities/writestatement');
// var WhileStatement = require('./entities/whilestatement');
// var IntegerLiteral = require('./entities/integerliteral');
// var BooleanLiteral = require('./entities/booleanliteral');
// var VariableReference = require('./entities/variablereference');
// var BinaryExpression = require('./entities/binaryexpression');
// var UnaryExpression = require('./entities/unaryexpression');
// var tokens = [];

module.exports = function(scannerOutput) {
  tokens = scannerOutput;
  for (token of tokens) {
    console.log(token);
  }
  var program = parseProgram();
  match('EOF');
  return program;
};

var parseProgram = function() {
  return new Program(parseBlock());
};

var parseBlock = function() {
  var statements = [];
  while (true) {
    statements.push(parseStatement());
    match(';');
    if (!at(['var', 'id', 'read', 'write', 'while'])) {
      break;
    }
  }
  return new Block(statements);
};

var parseStatement = function() {
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('id')) {
    return parseAssignmentStatement();
  // } else if (at('read')) {
  //   return parseReadStatement();
  // } else if (at('write')) {
  //   return parseWriteStatement();
  // } else if (at('while')) {
  //   return parseWhileStatement();
  } else {
    return error('Statement expected', tokens[0]);
  }
};

var parseVariableDeclaration = function() {
  match('var');
  var id = match('id');
  match(':');
  var type = parseType();
  return new VariableDeclaration(id, type);
};

var parseType = function() {
  if (at(['int', 'bool'])) {
    return Type.forName(match().lexeme);
  } else {
    return error('Type expected', tokens[0]);
  }
};

var parseAssignmentStatement = function() {
  var target = new VariableReference(match('id'));
  match('=');
  var source = parseExpression();
  return new AssignmentStatement(target, source);
};




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