var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
var TEST_DIR = 'test/data/good-programs';

describe('The compiler', function() {
  var i, len, name, ref, results;
  ref = fs.readdirSync(TEST_DIR);
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    results.push(it("should compile " + name + " without errors", function(done) {
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount;
        priorErrorCount = error.count;
        parse(tokens).analyze();
        error.count.should.eql(priorErrorCount);
        return done();
      });
    }));
  }
  return results;
});