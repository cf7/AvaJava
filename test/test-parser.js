var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner');
var parse = require('../parser');
var error = require('../error');
var error.quiet = true;
var TEST_DIR = 'test/data/syntax-errors';

describe('The parser detects an error for', function() {
  var ref = fs.readdirSync(TEST_DIR);
  var results = [];
  for (var i = 0, len = ref.length; i < len; i++) {
    var name = ref[i];
    var check = name.replace(/-/g, ' ').replace(/\.iki$/, '');
    results.push(it(check, function(done) {
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount;
        priorErrorCount = error.count;
        parse(tokens);
        error.count.should.be.above(priorErrorCount);
        return done();
      });
    }));
  }
  return results;
});