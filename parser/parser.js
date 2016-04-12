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

var blockStatementKeywords = ['var', 'id', 'while', 'ava', 'return', 'for', 'if'];

module.exports = function(scannerOutput) {
  console.log("********************PARSER******************");
  tokens = scannerOutput;
  // debugging
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
  console.log("inside parseBlock");
  var statements = [];
  var numberErrors = error.count;
  while (true) {
    statements.push(parseStatement());
    match(';');
    console.log("matched semicolon");
    if (!at(blockStatementKeywords)) { // hardcoded 'return' for error outside of function block
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  console.log("leaving parseBlock");
  return new Block(statements);
};

var parseStatement = function() {
  // since parseBlock no longer matches ';'s, need to match ';'
  // within each of these parseFunctions below
  console.log("inside parseStatement");
  if (at('var')) {
    return parseVariableDeclaration();
  } else if (at('ava')) {
    return parsePrintStatement();
  } else if (at('return')) {
    return parseReturnStatement();
  } else if (at('if')) {
    return parseConditionalExp();
  } else if (at('for')) {
    return parseForLoop();
  } else if (at('while')) {
    return parseWhileLoop();
  // } else if (at('id')) { // need to have lookahead before adding Assignment
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
  console.log("inside parseVariableDeclaration");
  var exp;
  match('var');
  var id = match('id');
  if (at('=')) {
    match('=');
    exp = parseExpression(); // right now doesn't do anything
    // but later when setting scope, will be passed into VariableDeclaration
    // or a similar entity
  }
  // var type = parseType();
  console.log("leaving parseVariableDeclaration");
  return new VariableDeclaration(id, exp); //, type);
};

var parseVariableReference = function () {
  console.log("inside parseVariableReference");
  var id = match('id');
  console.log("matched " + id.lexeme);

  if (at('(')) { //, 'id'])) { // currying
    console.log("going inside");
    return parseFunctionCall(id); // pass in id?
  } else if (at('=')) {
    return parseAssignmentStatement(id);
  } else {
    console.log("inside - id is " + id.lexeme);
    return new VariableReference(id);
  }

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
  console.log("inside parseIfBlock");
  var statements = [];
  var numberErrors = error.count;
  // if (at('return')) {
  //   statements.push(parseReturnStatement());
  // }
  while (true) {
    statements.push(parseStatement());
    // if (at(match(';'))) {
    //   match(';');
    // }
    if (!at(blockStatementKeywords)) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  console.log("leaving parseIfBlock");
  return new Block(statements);
}

var parseFunctionExp = function () {
  console.log("inside parseFunctionExp");
  match('(');
  var params = parseArgs();
  console.log("params " + params);
  match(')');
  match('->');
  var body = parseFunctionBlock();
    console.log("leaving parseFunctionExp");

  return new Function(params, body); // ast return cuts off here
}

var parseArgs = function () {
  console.log("inside parseArgs");
    var exps = parseExpList();
    console.log("parseArgs exps: " + exps);
        console.log("leaving parseArgs");
  return exps;
  // return
}

var parseExpList = function () {
  console.log("inside parseExpList");
  var exps = [];
  console.log("exps before: " + exps[0]);
  exps.push(parseExpression());
  console.log("exps after: " + exps[0]);
  while (at(',')) {
    match(',');
    exps.push(parseExpression());
  }
    console.log("leaving parseExpList");
  console.log("exps: " + exps);
  return exps;
  // return statement
}

var parseFunctionBlock = function () {
  console.log("#########inside parseFunctionBlock##########");
  var statements = [];
  var numberErrors = error.count;
  while (true) {
    statements.push(parseStatement());
    if (at('end')) {
      match('end');
      console.log("matched end");
      break;
    }
    if (!at(blockStatementKeywords)) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  // only print block statement, need to return entity that also includes args
    console.log("##########leaving parseFunctionBlock##########");

  return new Block(statements);
}

var parseFunctionCall = function (id) {
  console.log("inside parseFunctionCall: id " + id.lexeme);
  var params = [];
  if (at('id')) { // use later for currying
    // params.push(parseVariableReference());
  }
  if (at('(')) {
    match('('); // hardcoding for now until adding currying
    params = params.concat(parseArgs());
    match(')');
  } 
  // else { // currying
  //   while (!at([';', 'EOF'])) { // 'EOF' case accounts for missing semicolons
  //     params.push(parseExpression());
  //   }
  // }
  console.log("params: " + params);
  console.log("leaving parseFunctionCall");
  return new FunctionCall(id, params);
}


var parseAssignmentStatement = function(id) {
  var target = new VariableReference(id);
  match('=');
  var source = parseExpression();
  return new AssignmentStatement(target, source);
};

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

var parseForLoop = function () {
  console.log("inside parseForLoop");
  var id;
  var counter;
  var exp;
  var body;
  match('for');
  if (at('each')) { // for each loop
    match('each');
    // simulate having a variable to maintain syntax
    if (!at('var')) { // var optional in for each loops
      tokens.unshift({ kind: 'var', lexeme: 'var', line: tokens[0].line, col: tokens[0].col });
    }
    id = parseVariableDeclaration();
    match('in');
    exp = parseExpression();
    match('{');
    body = parseBlock();
    match('}');
  } else { // counter for loop
    exp = parseExpression();
    match('times');
    match('{');
    body = parseBlock();
    match('}');
  }
  console.log("leaving parseForLoop");
  return new ForLoop(id, exp, body);
}

var parseWhileLoop = function () {
  console.log("inside parseWhileLoop");
  match('while');
  match('(');
  var condition = parseExpression();
  match(')');
  match('{');
  var body = parseBlock();
  match('}');
  console.log("leaving parseWhileLoop");
  return new WhileLoop(condition, body);
}

var parseConditionalExp = function () {
  var elseifs;
  var elseBody;
  var body;
  var parentheses = false;
  console.log("inside parseConditionalExp");
  match('if');
  var conditional = parseExpression();
  match('then');
  body = parseIfBlock();
  if (at('else')) {
    match('else');
    if (at('if')) {
      elseifs = parseConditionalExp();
    } else {
      elseBody = parseIfBlock();
    }
  }
  return new IfElseStatements(conditional, body, elseifs, elseBody);
}

var parseExpression = function () {
  if (at('var')) {
    return parseVariableDeclaration();
  // } else if (at('if')) {
  //   return parseConditionalExp();
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
    console.log("inside binary parseExp2");
    op = match('and');
    right = parseExp3();
    left = new BinaryExpression(op, left, right);
  }
  if (at('both')) {   // avajava feature, using 'both' keyword
    match('both');
    right = parseExpression();
    left = new BothExpression(left, right); // pass in left side and right side
  }
  console.log("leaving parseExp2");
  return left;
}

var parseExp3 = function () {
  var op, left, right;
  console.log("inside parseExp3");
  left = parseExp4();
  if (at(['<', '>', '<=', '==', '>=', '!='])) {
    op = match();
    right = parseExp4();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

var parseExp4 = function () {
  var op, left, right;
  console.log("inside parseExp4");
  left = parseExp5();
  // if (at(['@'])) {
  //   op = match();
  //   right = parseExp5();
  //   left = new BinaryExpression(op, left, right);
  // }
  return left;
}

var parseExp5 = function () {
  var op, left, right;
  console.log("inside parseExp5");
  left = parseExp6();
  // if (at(['::'])) {
  //   op = match();
  //   right = parseExp6();
  //   left = new BinaryExpression(op, left, right);
  // }
  return left;
}

var parseExp6 = function () {
  var op, left, right;
  console.log("inside parseExp6");
  left = parseExp7();
  while (at(['+', '-'])) {
    op = match();
    right = parseExp7();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

// ** remember can store the things that are being matched!
// ** may need them to pass to a different parsing branch
var parseExp7 = function () {
  var op, left, right;
  console.log("inside parseExp7");
  left = parseExp8();
  while (at(['*', '/', '%'])) {
    op = match();
    right = parseExp8();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

// parseExp6
var parseExp8 = function () {
  var op, operand;
  console.log("inside parseExp8");
  if (at(['-', 'not'])) {
    op = match(); // need to branch to a different case for negation
    operand = parseExp9();
    return new UnaryExpression(op, operand);
  } else {
    return parseExp9();
  }
  // return statement
}

// parseExp7
var parseExp9 = function () {
  var op, operand;
  console.log("inside parseExp9");
  var operand = parseExp10();
  if (at(['!', '++', '--'])) {
    op = match();
    console.log("leaving parseExp9");
    return new PostfixExpression(op, operand);
  } else {
    console.log("leaving parseExp9");
    return operand;
  }
}

var parseExp10 = function () {
  var op, left, right;
  console.log("inside parseExp10");
  left = parseExp11();
  if (at('^^')) {
    op = match();
    right = parseExp11();
    left = new BinaryExpression(op, left, right);
  }
  console.log("leaving parseExp10");
  return left;
}

var parseExp11 = function () {
  console.log("inside parseExp11");
  if (at('(')) {
    match('(');
    return parseExpression();
    match(')');
  } else if (at('[')) {
    return parseList();
  } else if (at('intlit')) {
    return parseIntLiteral();
  } else if (at('floatlit')) {
    return parseFloatLiteral();
  } else if (at('stringlit')) { // hardcoding for now, change to 'literal' later
    return parseStringLiteral();
  } else if (at('id')) {
    var varref = parseVariableReference();
    console.log("Exp9 varref: " + varref);
    return varref; //parseVariableReference();
    // How do we distinguish between an id and a function Call?
  } else if (at(['true', 'false'])) {
    return new BooleanLiteral(match());
  // } else {
  //   error('inside parseExp9 error', tokens[0]);
  }
}

var parseList = function () {
  console.log("inside parseList");
  match('[');
  var exps = parseExpList();
  match(']');
  console.log("leaving parseList");
  return exps;
}

var parseIntLiteral = function () {
  console.log("inside parseIntLiteral");
  return new IntLiteral(match());
}

var parseFloatLiteral = function () {
  console.log("inside parseFloatLiteral");
  match('floatlit');
}

var parseStringLiteral = function () {
  console.log("inside parseStringLiteral");
  return new StringLiteral(match());
}

var parseReturnStatement = function () {
  console.log("inside parseReturnStatement");
  match('return');
  var exp = parseExpression();
    console.log("leaving parseReturnStatement");
  return new ReturnStatement(exp);//parseExpression();
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