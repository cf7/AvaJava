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
    if (!at('EOF') && statements[0]) {
      match(';');
    }
    console.log("matched semicolon");
    if (!at(blockStatementKeywords)) {
      break;
    } else if (error.count > numberErrors) {
      break;
    }
  }
  console.log("leaving parseBlock");
  console.log(statements);
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
  } else if (at('for')) {
    return parseForLoop();
  } else if (at('while')) {
    return parseWhileLoop();
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
  var op;
  if (at(['(', 'id', 'intlit', 'floalit', 'stringlit', 'boolit'])) { // need 'id' for currying (first two calls)
    // issue: for all variables case, will think non-function variables are functions
    // perhaps address this issue in semantics?
    console.log("going inside"); // hardcoding currying cases for now
    return parseFunctionCall(id); // pass in id?
    // hardcoding return type parsing for now
    /**
        // return type parsing
    */
  } else if (at(assignmentOperators)) {
    op = match();
    return parseAssignmentStatement(op, id);
  } else {
    console.log("inside - id is " + id.lexeme);
    return new VariableReference(id);
  }

}

// change parse types
var parseType = function() {
  if (at(['int', 'float', 'bool', 'string', 'function', 'list'])) {
    return Type.forName(match().lexeme); // need to return type into Type class for analyzer
    // so analyzer can check if it is valid, and if yes, set the type for this variable
    // in the environment
  } else {
    return error('Type expected', tokens[0]);
  }
};


var parseFunctionExp = function () {
  console.log("inside parseFunctionExp");
  match('function');
  match('(');
  var params = parseParams();
  console.log("params " + params);
  match(')');
  match('->');
  var body = parseFunctionBlock();
    console.log("leaving parseFunctionExp");

  return new Function(params, body); // ast return cuts off here
}

var parseParams = function () {
  console.log("inside parseParams");
  // var exps = parseExpList();
  var exps = [];
  if (at('id')) {
    exps = parseTypedExpressionList();
  }
  console.log("parseParams exps: " + exps);
  console.log("leaving parseParams");
  return exps;
  // return
}

var parseTypedExpressionList = function () {
  console.log("inside parseTypedExpressionList");
  var exps = [];
  exps.push(parseTypedExp());
  while (at(',')) {
    match(',');
    exps.push(parseTypedExp());
  }
  console.log("leaving parseTypedExpressionList");
  return exps;
}

var parseTypedExp = function () {
  console.log("inside parseTypedExp");
  var id = match('id');
  match(':');
  var type = parseType();
  console.log("leaving parseTypedExp");
  return new TypedVariableDeclaration(id, type);
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
  console.log("matched end");
  // only print block statement, need to return entity that also includes args
    console.log("##########leaving parseFunctionBlock##########");

  return new Block(statements);
}

var parseFunctionCall = function (id) {
  console.log("inside parseFunctionCall: id " + id.lexeme);
  var args = [];
  if (at('id')) { // use for currying, first id already matched beforehand
    args.push(parseVariableReference());
  } else { // if at another functionCall should not take in rest of line
    if (at('(')) {
      match('('); // hardcoding for now until adding currying
      args = args.concat(parseArgs());
      match(')');
    } else { // currying
      console.log("before non-function args");
      while (!at([';', 'EOF'])) { // 'EOF' case accounts for missing semicolons
        console.log("non-function args");
        args.push(parseExpression());
      }
    }
  }
  console.log("args: " + args);
  console.log("leaving parseFunctionCall");
  return new FunctionCall(id, args);
}

var parseArgs = function () {
  console.log("inside parseArgs");
  var exps = parseExpList();
  // var exps = parseTypedExpressionList();
  console.log("parseArgs exps: " + exps);
  console.log("leaving parseArgs");
  return exps;
  // return
}

var parseAssignmentStatement = function(op, id) {
  var target = new VariableReference(id);
  var source = parseExpression();
  return new AssignmentStatement(op, target, source);
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
    if (tokens[1].lexeme === 'times') {
      exp = parseExpression();
      match('times');
      match('{');
      body = parseBlock();
      match('}')
    } else if (at('(')) {
      match('(');
      id = parseVariableDeclaration();
      exp = parseConditionalExp();
      match(')');
      match('{');
      body = parseBlock();
      match('}');
    }
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
  var conditionals = [];
  var bodies = [];
  var elseifs = [];
  var elseBody;
  var parentheses = false;
  console.log("inside parseConditionalExp");
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
  console.log("inside parseExpression");
  if (at('function')) { // added an indicator to syntax
    // this is why other languages have a keyword
    // indicator for functions, because how could you differentiate
    // the beginning of a functionDeclaration from the beginning
    // of a parenthesized expression without lookahead?
    return parseFunctionExp();
  } else if (at('return')) {
    return parseReturnStatement();
  } else if (at('if')) {
    return parseConditionalExp();
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
  while(at('@')){
    op = match('@');
    right = parseExp11();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp5 = function () {
  var op, left, right;
  console.log("inside parseExp5");
  left = parseExp6();
  // while(at('::')){
  //   op = match('::');
  //   right = parseExp11();
  // }
  // while (at(['::'])) {
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
  if (at(['..', '...'])) {
    op = match();
    right = parseExp7();
    left = new BinaryExpression(op, left, right);
  }
  return left;
}

var parseExp7 = function () {
  var op, left, right;
  console.log("inside parseExp7");
  left = parseExp8();
  while (at(['+', '-'])) {
    op = match();
    right = parseExp8();
    console.log("=========================");
    left = new BinaryExpression(op, left, right);
    console.log("========================");
  }
  return left;
  // return statement
}

// ** remember can store the things that are being matched!
// ** may need them to pass to a different parsing branch
var parseExp8 = function () {
  var op, left, right;
  console.log("inside parseExp8");
  left = parseExp9();
  while (at(['*', '/', '%'])) {
    op = match();
    right = parseExp9();
    left = new BinaryExpression(op, left, right);
  }
  return left;
  // return statement
}

// parseExp6
var parseExp9 = function () {
  var op, operand;
  console.log("inside parseExp9");
  if (at(['-', 'not'])) {
    op = match(); // need to branch to a different case for negation
    operand = parseExp10();
    return new UnaryExpression(op, operand);
  } else {
    return parseExp10();
  }
  // return statement
}

// parseExp7
var parseExp10 = function () {
  var op, operand;
  console.log("inside parseExp10");
  var operand = parseExp11();
  if (at(['++', '--'])) { // add ! for factorial operation
    op = match();
    console.log("leaving parseExp9");
    return new PostfixExpression(op, operand);
  } else {
    console.log("leaving parseExp10");
    return operand;
  }
}

var parseExp11 = function () {
  var op, left, right;
  console.log("inside parseExp11");
  left = parseExp12();
  while (at('^^')) {
    op = match();
    right = parseExp12();
    left = new BinaryExpression(op, left, right);
  }
  console.log("leaving parseExp11");
  return left;
}

var parseExp12 = function () {
  console.log("inside parseExp12");
  if (at('(')) {
    match('(');
    var exp = parseExpression();
    match(')');
    return exp;
  } else if (at('[')) {
    return parseList();
  } else if (at('{')) {
    console.log("in here");
    return parseCollection();
  } else if (at('intlit')) {
    return parseIntegerLiteral();
  } else if (at('floatlit')) {
    return parseFloatLiteral();
  } else if (at('stringlit')) { // hardcoding for now, change to 'literal' later
    return parseStringLiteral();
  } else if (at('id')) {
    var exps = [];
    var varref = parseVariableReference();
    console.log("Exp11 varref: " + varref);
    if (at(['[', '.'])) {
      while (at(['[', '.'])) {
        while (at('[')) {
          match('[');
          exps.push(parseExpression());
          match(']');
        }
        while (at('.')) {
          match('.');
          exps.push(parseExpression()); // in grammar needs to be Exp12 for continuous accesses
        }
      }
      varref = new Access(varref, exps);
    }
    return varref;
    // How do we distinguish between an id and a function Call?
  } else if (at(['true', 'false'])) {
    return parseBooleanLiteral();
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
  return new ListLiteral(exps);
}

// var parseAccess = function (id) {
//   match('[');
//   var exp = parseExpression();
//   match(']');
//   return new Access(id, exp);
// }

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
  console.log("inside ObjectExp");
  var key = match().lexeme;
  match(':');
  var value = parseExpression();
  console.log("value: " + value);
  console.log("leaving ObjectExp");
  exp[key] = value;
  return exp
}

var parseObjectExpList = function () {
  console.log("inside parseObjectExpList");
  var exps = parseObjectExp();
  while (at(',')) {
    match(',');
    Object.assign(exps, parseObjectExp());
  }
  console.log("exps: " + exps);
  console.log("leaving parseObjectExpList");
  return exps;
  // return statement
}

var parseObject = function () {
  console.log("inside parseObject");
  var exps = parseObjectExpList();
  console.log("leaving parseObject");
  return new ObjectLiteral(exps);
}

var parseSet = function () {
  console.log("inside parseSet");
  var exps = parseExpList();
  console.log("leaving parseSet");
  return new SetLiteral(exps);
}

var parseIntegerLiteral = function () {
  console.log("inside parseIntegerLiteral");
  return new IntegerLiteral(match());
}

var parseFloatLiteral = function () {
  console.log("inside parseFloatLiteral");
  return new FloatLiteral(match()); // need to implement floatlits
}

var parseStringLiteral = function () {
  console.log("inside parseStringLiteral");
  return new StringLiteral(match());
}

var parseBooleanLiteral = function () {
  console.log("inside parseBooleanLiteral");
  return new BooleanLiteral(match());
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