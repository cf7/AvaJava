var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
error.quiet = false;
var TEST_DIR = 'test/data/semantic-errors';

describe('The analyzer detects an error for', function() {
  return fs.readdirSync(TEST_DIR).forEach( function (name) {
    if (name !== ".DS_Store") {
      var check = name.replace(/-/g, ' ').replace(/\.ava$/, '');
      return it(check, function(done) {
        return scan(path.join(TEST_DIR, name), function(tokens) {
          var priorErrorCount = error.count;
          var program = parse(tokens);
          error.count.should.equal(priorErrorCount);
          program.analyze();
          error.count.should.be.above(priorErrorCount);
          return done();
        });
      });
    }
  });
});