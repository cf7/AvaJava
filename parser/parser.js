var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var Type = require('../entities/type.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
var Print = require('../entities/print.js');
var AssignmentStatement = require('../entities/assignmentstatement.js');
// var ReadStatement = require('./entities/readstatement');
// var WriteStatement = require('./entities/writestatement');
// var WhileStatement = require('./entities/whilestatement');
// var IntegerLiteral = require('./entities/integerliteral');
// var BooleanLiteral = require('./entities/booleanliteral');
// var VariableReference = require('./entities/variablereference');
// var BinaryExpression = require('./entities/binaryexpression');
// var UnaryExpression = require('./entities/unaryexpression');
var tokens = [];

module.exports = function(scannerOutput) {
  tokens = scannerOutput;
  // debugging
  for (token of tokens) {
    console.log(token);
  }
  var program = parseProgram();
  match('EOF');
  // programs are accidentally passing themselves
  // or maybe that is supposed to happen
  // console.log("*******" + program);
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
  } else if (at('ava')) {
    return parsePrintStatement();
  // } else if (at('id')) {
  //   return parseAssignmentStatement();
  // } else if (at('read')) {
  //   return parseReadStatement();
  // } else if (at('write')) {
  //   return parseWriteStatement();
  // } else if (at('while')) {
  //   return parseWhileStatement();
  } else {
    return error('Statement expected', tokens[0]);
  }
  match(';');
};

var parseVariableDeclaration = function() {
  // match with a 'var', if yes
  // shift tokens left (i.e. delete current token
  // and shift index of rest of tokens down)
  match('var');
  var id = match('id');
  if (at('=')) {
    match('=');
    var exp = parseExpression(); // right now doesn't do anything
    // but later when setting scope, will be passed into VariableDeclaration
    // or a similar entity
  }
  // match(';');
  // var type = parseType();
  return new VariableDeclaration(id) //, type);
};

// change parse types
var parseType = function() {
  if (at(['int', 'bool', 'string', ])) {
    return Type.forName(match().lexeme);
  } else {
    return error('Type expected', tokens[0]);
  }
};

// var parseAssignmentStatement = function() {
//   var target = new VariableReference(match('id'));
//   match('=');
//   var source = parseExpression();
//   return new AssignmentStatement(target, source);
// };

// one of the parser tests isn't passing because for some
// reason the parser doesn't throw an error
// even if match() detects one in parsePrintStatement
var parsePrintStatement = function () {
  // add case for when there are single quotes
  match('ava');
  var expression = parseExpression();
  // match(';');
  return new Print(expression);
}

var parseExpression = function () {
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('if')) {
    return parseConditionalExp();
  } else if (at('(')) {
    return parseFunctionExp();
  } else if (at('stringlit')) { // hardcoding for now, change to Exp2 later
    return parseExp2();
  } else {
    return error('inside parse expression error', tokens[0]);
  }
  // need cases for 'both' and 'not' keywords
}

var parseExp2 = function () { // this will become Exp7 when the other expression are added
  if (at('(')) {
    match('(');
    parseExpression();
    match(')');
  } else if (at('stringlit')) { // hardcoding for now, change to 'literal' later
    parseStringLiteral();
  } else if (at('id')) {
    match('id');
    // parseId
  } else {
    error('inside parseExp2 error', tokens[0]);
  }
}

var parseStringLiteral = function () {
  match('stringlit');
  console.log("inside parseStringLiteral");
}

var parseConditionalExp = function () {
  console.log("inside parseConditionalExp");
  match('if');
  parseExpression();
  match('then');
  parseBlock(); // need to figure out how to return
  // without explicitly calling a return statement
  if (at('else')) {
    match('else');
    if (at('if')) {
      parseConditionalExp();
    } else {
      parseBlock();
    }
  }
  // match(';');
  // add case for return statements
}

var parseReturnStatement = function () {
  console.log("inside parseReturnStatement");
}

var parseExpWithBoth = function () {
  console.log("inside parseExpWithBoth");
}

var parseFunctionExp = function () {
  console.log("inside parseFunctionExp");
  match('(');
  var params = parseParams();
  match(')');
  match('->');
  var exp = parseBlock();
}

var parseParams = function () {
  console.log("inside parseParams");
}

var at = function(kind) {
  if (tokens.length === 0) {
    return false;
  } else if (Array.isArray(kind)) {
    // if array has more than one element,
    // recursively iterate through tokens
    // until matching kind with an element
    return kind.some(at);
  } else {
    return kind === tokens[0].kind;
  }
};

// match shifts the tokens down the line
// to match with the next one and so on
// as the parser progresses through the rules
// returns the token that is being removed
// reason some of the parse functions above do not throw errors
// is because match will throw an error if there is no match
var match = function(kind) {
  if (tokens.length === 0) {
    return error('Unexpected end of source program');
  } else if (kind === void 0 || kind === tokens[0].kind) {
    return tokens.shift();
  } else {
    return error("Expected \"" + kind + "\" but found \"" + tokens[0].kind + "\"", tokens[0]);
  }
};