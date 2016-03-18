var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
error.quiet = true;
var TEST_DIR = 'test/data/semantic-errors';

describe('The analyzer detects an error for', function() {
  var check, i, len, name, ref, results;
  ref = fs.readdirSync(TEST_DIR);
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    check = name.replace(/-/g, ' ').replace(/\.iki$/, '');
    results.push(it(check, function(done) {
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount, program;
        priorErrorCount = error.count;
        program = parse(tokens);
        error.count.should.equal(priorErrorCount);
        program.analyze();
        error.count.should.be.above(priorErrorCount);
        return done();
      });
    }));
  }
  return results;
});