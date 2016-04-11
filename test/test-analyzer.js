var TEST_DIR, error, fs, parse, path, scan, should;

fs = require('fs');

path = require('path');

should = require('should');

scan = require('../scanner');

parse = require('../parser');

error = require('../error');

error.quiet = true;

TEST_DIR = 'test/data/semantic-errors';

describe('The analyzer detects an error for', function() {
  return fs.readdirSync(TEST_DIR).forEach(function(name) {
    var check;
    check = name.replace(/-/g, ' ').replace(/\.iki$/, '');
    return it(check, function(done) {
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount, program;
        priorErrorCount = error.count;
        program = parse(tokens);
        error.count.should.equal(priorErrorCount);
        program.analyze();
        error.count.should.be.above(priorErrorCount);
        return done();
      });
    });
  });
});