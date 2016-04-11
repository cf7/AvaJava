var TEST_DIR, error, fs, parse, path, scan, should;

fs = require('fs');

path = require('path');

should = require('should');

scan = require('../scanner');

parse = require('../parser');

error = require('../error');

TEST_DIR = 'test/data/good-programs';

describe('The compiler', function() {
  return fs.readdirSync(TEST_DIR).forEach(function(name) {
    return it("should compile " + name + " without errors", function(done) {
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount;
        priorErrorCount = error.count;
        parse(tokens).analyze();
        error.count.should.eql(priorErrorCount);
        return done();
      });
    });
  });
});