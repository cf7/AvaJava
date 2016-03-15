var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
error.quiet = true;
var TEST_DIR = 'test/data/syntax-errors';

describe('The parser detects an error for', function() {
  // read in the files from the TEST_DIR ("test directory")
  var ref = fs.readdirSync(TEST_DIR);
  var results = [];
  for (var i = 0, len = ref.length; i < len; i++) {
    // grab the name of the file at the current index
    var name = ref[i];
    // find all dashes "-" and ".ava"'s in the filename and remove them
    var check = name.replace(/-/g, ' ').replace(/\.ava$/, '');
    console.log(check);
    // mocha will print the results of the tests using the modified filenames
    // "The parser detects an error for"
    // "1) missing bracket"
    // "..."
    results.push(it(check, function(done) {
      // scan in the tokens from the file and return them
      return scan(path.join(TEST_DIR, name), function(tokens) {
        var priorErrorCount = error.count;
        // parses the tokens array into a JSON
        parse(tokens);
        error.count.should.be.above(priorErrorCount);
        return done();
      });
    }));
  }
  return results;
});