var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var Type = require('../entities/type.js');
// var VariableDeclaration = require('./entities/variabledeclaration');
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
  } else if (at('read')) {
    return parseReadStatement();
  } else if (at('write')) {
    return parseWriteStatement();
  } else if (at('while')) {
    return parseWhileStatement();
  } else {
    return error('Statement expected', tokens[0]);
  }
};

// var parseVariableDeclaration = function() {
//   var id, type;
//   match('var');
//   id = match('id');
//   match(':');
//   type = parseType();
//   return new VariableDeclaration(id, type);
// };