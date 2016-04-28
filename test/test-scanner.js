
// // baseline code from Iki

var should = require('should');
var scan = require('../scanner/scanner.js');
var error = require('../error.js');
var i = require('util').inspect;

describe('The scanner', function() {
  it('scans a simple program', function(done) {
    return scan('test/data/good-programs/peace.ava', function(tokens) {
      tokens.length.should.equal(14);
      i(tokens[0]).should.equal(i({
        kind: 'var',
        lexeme: 'var',
        line: 1,
        col: 1
      }));
      i(tokens[1]).should.equal(i({
        kind: 'id',
        lexeme: 'hello',
        line: 1,
        col: 5
      }));
      i(tokens[2]).should.equal(i({
        kind: '=',
        lexeme: '=',
        line: 1,
        col: 11
      }));
      i(tokens[3]).should.equal(i({
        kind: 'function',
        lexeme: 'function',
        line: 1,
        col: 13
      }));
      i(tokens[3]).should.equal(i({
        kind: '(',
        lexeme: '(',
        line: 1,
        col: 13
      }));
      i(tokens[4]).should.equal(i({
        kind: ')',
        lexeme: ')',
        line: 1,
        col: 14
      }));
      i(tokens[5]).should.equal(i({
        kind: '->',
        lexeme: '->',
        line: 1,
        col: 16
      }));
      i(tokens[6]).should.equal(i({
        kind: 'ava',
        lexeme: 'ava',
        line: 1,
        col: 19
      }));
      i(tokens[7]).should.equal(i({
        kind: 'stringlit',
        lexeme: '\"Peace\"',
        line: 1,
        col: 23
      }));
      i(tokens[8]).should.equal(i({
        kind: 'end',
        lexeme: 'end',
        line: 1,
        col: 31
      }));
      i(tokens[9]).should.equal(i({
        kind: ';',
        lexeme: ';',
        line: 1,
        col: 34
      }));
      i(tokens[10]).should.equal(i({
        kind: 'var',
        lexeme: 'var',
        line: 3,
        col: 1
      }));
      i(tokens[11]).should.equal(i({
        kind: 'id',
        lexeme: 'x',
        line: 3,
        col: 5
      }));
      i(tokens[12]).should.equal(i({
        kind: ';',
        lexeme: ';',
        line: 3,
        col: 6
      }));
      i(tokens[13]).should.equal(i({
        kind: 'EOF',
        lexeme: 'EOF'
      }));
      return done();
    });
  });
  it('properly handles comments and blank lines', function(done) {
    return scan('test/data/token-tests/comments-and-blank-lines', function(tokens) {
      tokens.length.should.equal(4);
      i(tokens[0]).should.equal(i({
        kind: 'var',
        lexeme: 'var',
        line: 2,
        col: 1
      }));
      i(tokens[1]).should.equal(i({
        kind: 'id',
        lexeme: 'x',
        line: 6,
        col: 1
      }));
      i(tokens[2]).should.equal(i({
        kind: ';',
        lexeme: ';',
        line: 7,
        col: 1
      }));
      i(tokens[3]).should.equal(i({
        kind: 'EOF',
        lexeme: 'EOF'
      }));
      return done();
    });
  });
  it('reads symbolic tokens properly', function(done) {
    return scan('test/data/token-tests/symbols', function(tokens) {
      i(tokens[0]).should.equal(i({
        kind: '<=',
        lexeme: '<=',
        line: 1,
        col: 1
      }));
      i(tokens[1]).should.equal(i({
        kind: '<',
        lexeme: '<',
        line: 1,
        col: 3
      }));
      i(tokens[2]).should.equal(i({
        kind: ',',
        lexeme: ',',
        line: 1,
        col: 4
      }));
      i(tokens[3]).should.equal(i({
        kind: '=',
        lexeme: '=',
        line: 1,
        col: 5
      }));
      i(tokens[4]).should.equal(i({
        kind: '->',
        lexeme: '->',
        line: 1,
        col: 6
      }));
      i(tokens[5]).should.equal(i({
        kind: '!=',
        lexeme: '!=',
        line: 1,
        col: 8
      }));
      i(tokens[6]).should.equal(i({
        kind: '/',
        lexeme: '/',
        line: 1,
        col: 10
      }));
      i(tokens[7]).should.equal(i({
        kind: '*',
        lexeme: '*',
        line: 1,
        col: 11
      }));
      i(tokens[8]).should.equal(i({
        kind: '[',
        lexeme: '[',
        line: 1,
        col: 12
      }));
      i(tokens[9]).should.equal(i({
        kind: ']',
        lexeme: ']',
        line: 1,
        col: 13
      }));
      i(tokens[10]).should.equal(i({
        kind: '+',
        lexeme: '+',
        line: 1,
        col: 14
      }));
      i(tokens[11]).should.equal(i({
        kind: 'EOF',
        lexeme: 'EOF'
      }));
      return done();
    });
  });
  it('distinguishes reserved words and identifiers', function(done) {
    return scan('test/data/token-tests/words', function(tokens) {
      i(tokens[0]).should.equal(i({
        kind: 'while',
        lexeme: 'while',
        line: 1,
        col: 1
      }));
      i(tokens[1]).should.equal(i({
        kind: 'for',
        lexeme: 'for',
        line: 1,
        col: 7
      }));
      i(tokens[2]).should.equal(i({
        kind: 'true',
        lexeme: 'true',
        line: 1,
        col: 11
      }));
      i(tokens[3]).should.equal(i({
        kind: 'false',
        lexeme: 'false',
        line: 1,
        col: 16
      }));
      i(tokens[4]).should.equal(i({
        kind: 'not',
        lexeme: 'not',
        line: 1,
        col: 22
      }));
      i(tokens[5]).should.equal(i({
        kind: 'and',
        lexeme: 'and',
        line: 1,
        col: 26
      }));
      i(tokens[6]).should.equal(i({
        kind: 'or',
        lexeme: 'or',
        line: 1,
        col: 30
      }));
      i(tokens[7]).should.equal(i({
        kind: 'id',
        lexeme: 'maybe',
        line: 1,
        col: 33
      }));
      i(tokens[8]).should.equal(i({
        kind: 'both',
        lexeme: 'both',
        line: 1,
        col: 39
      }));
      i(tokens[9]).should.equal(i({
        kind: 'if',
        lexeme: 'if',
        line: 1,
        col: 44
      }));
      i(tokens[10]).should.equal(i({
        kind: 'then',
        lexeme: 'then',
        line: 1,
        col: 47
      }));
      i(tokens[11]).should.equal(i({
        kind: 'else',
        lexeme: 'else',
        line: 1,
        col: 52
      }));
      i(tokens[12]).should.equal(i({
        kind: 'in',
        lexeme: 'in',
        line: 1,
        col: 57
      }));
      i(tokens[13]).should.equal(i({
        kind: 'return',
        lexeme: 'return',
        line: 1,
        col: 60
      }));
      i(tokens[14]).should.equal(i({
        kind: 'ava',
        lexeme: 'ava',
        line: 1,
        col: 67
      }));
      i(tokens[15]).should.equal(i({
        kind: 'EOF',
        lexeme: 'EOF'
      }));
      return done();
    });
  });
  it('scans numbers properly', function(done) {
    return scan('test/data/token-tests/numbers', function(tokens) {
      tokens.length.should.equal(5);
      i(tokens[0]).should.equal(i({
        kind: 'intlit',
        lexeme: '1000',
        line: 1,
        col: 1
      }));
      i(tokens[1]).should.equal(i({
        kind: 'floatlit',
        lexeme: '34.3123',
        line: 1,
        col: 6
      }));
      i(tokens[2]).should.equal(i({
        kind: 'floatlit',
        lexeme: '34.3123e4',
        line: 1,
        col: 14
      }));
      i(tokens[3]).should.equal(i({
        kind: 'floatlit',
        lexeme: '1000E-3',
        line: 1,
        col: 24
      }));
      i(tokens[4]).should.equal(i({
        kind: 'EOF',
        lexeme: 'EOF'
      }));
      return done();
    });
  });
  return it('detects illegal characters', function(done) {
    error.count = 0;
    return scan('test/data/token-tests/illegal-char', function(tokens) {
      console.log("error count: " + error.count);
      error.count.should.equal(1); // not working right now because error count
      // is actually accumulating from other errors and maybe even other tests
      // so, there is actually more than one error
      return done();
    });
  });
});