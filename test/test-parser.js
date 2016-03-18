var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
error.quiet = false;
var TEST_DIR = 'test/data/syntax-errors';

// ** if the first filename is .DS_Store, then
// ** the test-parser will test filenames themselves as code
// ** because they are accidentally tokenized by scan

describe('The parser detects an error for', function() {
  // read in the files from the TEST_DIR ("test directory")
  return fs.readdirSync(TEST_DIR).forEach( function (name) {
    if (name !== ".DS_Store") {
      // grab the name of the file at the current index
      // find all dashes "-" and ".ava"'s in the filename and remove them
      var check = name.replace(/-/g, ' ').replace(/\.ava$/, '');
      // mocha will print the results of the tests using the modified filenames
      // "The parser detects an error for"
      // "1) missing bracket"
      // "..."
      return it(check, function(done) {
        // scan in the tokens from the file and return them
        return scan(path.join(TEST_DIR, name), function(tokens) {
          var priorErrorCount = error.count;
          // send to parser.js
          parse(tokens);
          error.count.should.be.above(priorErrorCount);
          console.log("error count after: " + error.count);
          return done();
        });
      });
    }
  });
});
