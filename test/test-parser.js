var fs = require('fs');
var path = require('path');
var should = require('should');
var scan = require('../scanner/scanner.js');
var parse = require('../parser/parser.js');
var error = require('../error.js');
error.quiet = true;
var TEST_DIR = 'test/data/syntax-errors';

// ** if the first filename is .DS_Store, then
// ** the test-parser will test filenames themselves as code
// ** because they are accidentally tokenized by scan

// this code doesn't work
// the for loop and callback are too slow
// by the time the callback happens, the loop is already at the last file
// in the directory, have to use a forEach loop, then each iteration
// gets its own name
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
          // parses the tokens array into a JSON
          parse(tokens);
          error.count.should.be.above(priorErrorCount);
          return done();
        });
      });
    }
  });
});
