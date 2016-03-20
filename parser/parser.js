var scanner = require('../scanner/scanner.js');
var error = require('../error.js');
var Program = require('../entities/program.js');
var Block = require('../entities/block.js');
var Type = require('../entities/type.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
var Print = require('../entities/print.js');
var AssignmentStatement = require('../entities/assignmentstatement.js');
var IfElseStatements = require('../entities/ifelseexpressions.js');
var IntLiteral = require('../entities/integerliteral.js');
var BinaryExpression = require('../entities/binaryexpression.js');
var UnaryExpression = require('../entities/unaryexpression.js');
var FunctionCall = require('../entities/functioncall.js');
// var ReadStatement = require('./entities/readstatement');
// var WriteStatement = require('./entities/writestatement');
// var WhileStatement = require('./entities/whilestatement');
// var IntegerLiteral = require('./entities/integerliteral');
var BooleanLiteral = require('../entities/booleanliteral.js');
var VariableReference = require('../entities/variablereference.js');
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
  var numberErrors = error.count;
  while (true) {
    statements.push(parseStatement());
    if (!at(['var', 'id', 'while'])) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  return new Block(statements);
};

// ** semi-colons are currently being matched only after FunctionBlocks!

var parseStatement = function() {
  // since parseBlock no longer matches ';'s, need to match ';'
  // within each of these parseFunctions below
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('ava')) {
    return parsePrintStatement();
  } else if (at('return')) {
    return parseReturnStatement();
  // } else if (at('id')) {
  //   return parseAssignmentStatement();
  // } else if (at('read')) {
  //   return parseReadStatement();
  // } else if (at('write')) {
  //   return parseWriteStatement();
  // } else if (at('while')) {
  //   return parseWhileStatement();
  } else {
    return parseExpression();//error('Statement expected', tokens[0]);
  }
};

var parseVariableDeclaration = function() {
  // match with a 'var', if yes
  // shift tokens left (i.e. delete current token
  // and shift index of rest of tokens down)
  var exp = {};
  match('var');
  var id = match('id');
  if (at('=')) {
    match('=');
    exp = parseExpression(); // right now doesn't do anything
    // but later when setting scope, will be passed into VariableDeclaration
    // or a similar entity
  }
  // var type = parseType();
  return new VariableDeclaration(id, exp); //, type);
};

var parseVariableReference = function () {
  console.log("inside parseVariableReference");
  var id = match('id');
  if (at('(')) {
    return parseFunctionCall(id); // pass in id?
  } else {
    return new VariableReference(id);
  }
  console.log("leaving parseVariableReference");
}

// change parse types
var parseType = function() {
  if (at(['int', 'float', 'bool', 'string'])) {
    return Type.forName(match().lexeme); // ned to return type into Type class for analyzer
    // so analyzer can check if it is valid, and if yes, set the type for this variable
    // in the environment
  } else {
    return error('Type expected', tokens[0]);
  }
};

var parseIfBlock = function () {
  var statements = [];
  var numberErrors = error.count;
  if (at('return')) {
    statements.push(parseReturnStatement());
  }
  // while (true) {
  //   statements.push(parseStatement());
  //   if (at(match(';'))) {
  //     match(';');
  //   }
  //   if (!at(['var', 'id', 'while'])) {
  //     break;
  //   } else if (error.count > numberErrors) {
  //     break;
  //   }
  // }
  return new Block(statements);
  console.log("leaving parseIfBlock");
}

var parseFunctionExp = function () {
  console.log("inside parseFunctionExp");
  match('(');
  var params = parseArgs();
  match(')');
  match('->');
  return parseFunctionBlock(); // ast return cuts off here
  console.log("leaving parseFunctionExp");
}

var parseArgs = function () {
  console.log("inside parseArgs");
  var exp = parseExpList();
  // return
  console.log("leaving parseArgs");
}

var parseFunctionBlock = function () {
  console.log("inside parseFunctionBlock");
  var statements = [];
  var numberErrors = error.count;
  while (true) {
    statements.push(parseStatement());
    match(';');
    if (!at(['var', 'id', 'while'])) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  console.log("leaving parseFunctionBlock");
}

var parseFunctionCall = function (id) {
  console.log("inside parseFunctionCall: id " + id.lexeme);
  if (at('id')) { // use later for currying
    // parseFunctionCall
  }
  match('('); // hardcoding for now until adding currying
  var params = parseArgs();
  match(')');
    console.log("leaving parseFunctionCall");

  return new FunctionCall(id, params);
}

var parseExpList = function () {
  console.log("inside parseExpList");
  var exps = [];
  exps.push(parseExpression());
  while (at(',')) {
    match(',');
    exps.push(parseExpression());
  }
  // return statement
  console.log("leaving parseExpList");
}


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

var parseConditionalExp = function () {
  var elseifs = {};
  var elseBody = {};
  console.log("inside parseConditionalExp");
  match('if');
  var conditional = parseExpression();
  match('then');
  var body = parseIfBlock(); // need to figure out how to return
  // without explicitly calling a return statement
  if (at('else')) {
    match('else');
    if (at('if')) {
      elseifs = parseConditionalExp();
    } else {
      elseBody = parseIfBlock();
    }
  }
  return new IfElseStatements(conditional, body, elseifs, elseBody);
  // match(';');
  // add case for return statements
}

var parseExpression = function () {
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('if')) {
    return parseConditionalExp();
  } else if (at('(')) {
    return parseFunctionExp();
  } else {
    return parseExp1(); //error('inside parse expression error', tokens[0]);
  }
  // need cases for 'both' and 'not' keywords
}

var parseExp1 = function () {
  var op, left, right;
  console.log("inside parseExp1");
  left = parseExp2();
  while (at('or')) {
    op = match('or');
    right = parseExp2();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

var parseExp2 = function () {
  var op, left, right;
  console.log("inside parseExp2");
  left = parseExp3();
  while (at('and')) {
    op = match('and');
    right = parseExp3();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp3 = function () {
  var op, left, right;
  console.log("inside parseExp3");
  left = parseExp4();
  if (at(['<=', '==', '>=', '!='])) {
    op = match();
    right = parseExp4();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

var parseExp4 = function () {
  var op, left, right;
  console.log("inside parseExp5");
  left = parseExp5();
  while (at(['+', '-'])) {
    op = match();
    right = parseExp5();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

// ** remember can store the things that are being matched!
// ** may need them to pass to a different parsing branch
var parseExp5 = function () {
  var op, left, right;
  console.log("inside parseExp5");
  left = parseExp6();
  while (at(['*', '/'])) {
    op = match();
    right = parseExp6();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

// parseExp6
var parseExp6 = function () {
  var op, operand;
  console.log("inside parseExp6");
  if (at(['-', 'not'])) {
    op = match(); // need to branch to a different case for negation
    operand = parseExp7();
    return new UnaryExpression(op, operand);
  } else {
    return parseExp7();
  }
  // return statement
}

// parseExp7
var parseExp7 = function () {
  var op, operand;
  console.log("inside parseExp7");
  var exp8 = parseExp8();
  if (at(['!', '++', '--', '^^', '::', '@'])) {
    op = match();
    operand = parseExp8();
    return new PostfixExpression(op, operand);
  } else {
    return parseExp8();
  }
  // return statement
}

var parseExp8 = function () {
  var op, left, right;
  console.log("inside parseExp8");
  left = parseExp9();
  if (at('^^')) {
    op = match();
    right = parseExp9();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

var parseExp9 = function () {
  console.log("inside parseExp9");
  if (at('(')) {
    match('(');
    return parseExpression();
    match(')');
  } else if (at('intlit')) {
    return parseIntLiteral();
  } else if (at('floatlit')) {
    return parseFloatLiteral();
  } else if (at('stringlit')) { // hardcoding for now, change to 'literal' later
    return parseStringLiteral();
  } else if (at('id')) {
    return parseVariableReference();
    // How do we distinguish between an id and a function Call?
  } else if (at(['true', 'false'])) {
    return new BooleanLiteral(match());
  // else {
  //   error('inside parseExp9 error', tokens[0]);
  }
}

var parseIntLiteral = function () {
  console.log("inside parseIntLiteral");
  return new IntegerLiteral(match());
}

var parseFloatLiteral = function () {
  console.log("inside parseFloatLiteral");
  match('floatlit');
}

var parseStringLiteral = function () {
  console.log("inside parseStringLiteral");
  match('stringlit');
}

var parseReturnStatement = function () {
  console.log("inside parseReturnStatement");
  match('return');
  return parseExpression();
  console.log("leaving parseReturnStatement");
}

var parseExpWithBoth = function () {
  console.log("inside parseExpWithBoth");
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