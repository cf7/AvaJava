var TEST_DIR, error, fs, parse, path, scan, should;

fs = require('fs');

path = require('path');

should = require('should');

scan = require('../scanner/scanner.js');

parse = require('../parser/parser.js');

error = require('../error.js');

TEST_DIR = 'test/data/good-programs';

describe('The compiler', function() {
  return fs.readdirSync(TEST_DIR).forEach(function(name) {
    if (name !== ".DS_Store") {
      return it("should compile " + name + " without errors", function(done) {
        return scan(path.join(TEST_DIR, name), function(tokens) {
          var priorErrorCount;
          priorErrorCount = error.count;
          parse(tokens).analyze();
          error.count.should.eql(priorErrorCount);
          return done();
        });
      });
    }
  });
});