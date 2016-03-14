var fs = require('fs');
var byline = require('byline');
var XRegExp = require('xregexp');
var error = require('../error.js');

var LETTER = XRegExp('[\\p{L}]');
var DIGIT = XRegExp('[\\p{Nd}]');
var WORD_CHAR = XRegExp('[\\p{L}\\p{Nd}_]');
var KEYWORDS = /^(?:var|while|and|or|not|true|false|return|for|each|if|then|else|in|both|less than|greater than|ava)$/;
var oneCharacterTokens = /[+\-*\/()\[\]{},:;=\<\>\%\@\.Ee\!]/;
var twoCharacterTokens = /<=|==|>=|!=|\+=|\-=|\*=|\/=|\+\+|\-\-|\^\^|::|\.\.|\->/;
var threeCharacterTokens = /...|\*\*\*/;
var FLOAT = /^(\.\d+|\d+(\.\d+)?)([Ee][+-]?\d+)?$/;
var stringTokens; // code for strings

// When other files, such as test-scanner, require scanner.js,
// module.exports is the function that they require
// so in test-scanner, module.exports is being required into a 
// variable named "scan", in the first describe-it sequence of tests,
// notice that in the first "it" the "scan" variable is being called,
// and filename and callback function are being passed in
module.exports = function(filename, callback) {
  // setting up the scanning action
  var baseStream = fs.createReadStream(filename, { encoding: 'utf8' });
  baseStream.on('error', function(err) {
    return error(err);
  });

  // setting it to scan line by line
  var stream = byline(baseStream, { keepEmptyLines: true });
  var tokens = [];
  var linenumber = 0;
  
  // the 'readable' event is received when data can be read 
  // from the stream, the stream passes data to the callback function
  stream.on('readable', function() {
    // read in the next line and send it to the scan function
    // defined later in scanner.js
    // return the tokens that scan returns
    // the read() function reads data from the internal buffer
    // when there is nothing to read it returns null
    return scan(stream.read(), linenumber++, tokens);
  });
    // the stream looks for the 'end' event to stop reading,
    // if it encounters it, the last token pushed into tokens
    // is the EOF (End Of File) token
  return stream.once('end', function() {
    tokens.push({
      kind: 'EOF',
      lexeme: 'EOF'
    });
    return callback(tokens);
  });
};

// when module.exports calls this scan function, it passes
// in an entire line of symbols stored in an array (including
// space, tab, and newline characters)
var scan = function (line, lineNumber, tokens) {
  if (!line) {
    return;
  } else {
    var start = 0;
    var pos = 0;
    // function that will store token data to be outputted by the scanner
    // as a whole
    var emit = function (kind, lexeme) {
      tokens.push({ kind: kind, lexeme: (lexeme || kind), line: lineNumber, col: start+1 });
    }
    var substring = "";

    while (true) {

      // skip spaces
      while (/\s/.test(line[pos])) {
        pos++;
      }

      start = pos;

      // if reached end of line, leave while loop
      if (pos >= line.length) {
        break;
      }
      // if reached comments in the line, leave while loop
      if (line[pos] === '/' && line[pos + 1] === '/') {
        break;
      }

      // checking for 1, 2, and 3 symbol groups to tokenize
      // checks them against regular expressions defined above
      if (threeCharacterTokens.test(line.substring(pos, pos + 3))) {
        emit(line.substring(pos, pos + 3));
        pos += 3;
      } else if (twoCharacterTokens.test(line.substring(pos, pos + 2))) {
        emit(line.substring(pos, pos + 2));
        pos += 2;
      } else if (oneCharacterTokens.test(line[pos])) {
        emit(line[pos++]);
      } else 
      if (LETTER.test(line[pos])) {
        while (WORD_CHAR.test(line[pos]) && pos < line.length) {
          pos++;
        }
        word = line.substring(start, pos);
        emit((KEYWORDS.test(word) ? word : 'id'), word);
      } else if (DIGIT.test(line[pos])) {
        var substring = "";
        var regy = /\d\s/;
        while (!/\s/.test(line[pos])) {
          substring = substring + line[pos];
          if (regy.test(line.substring(pos, pos + 1))) {
              break;
          }
          pos++;
        }    
        if (FLOAT.test(substring)) {
          emit('floatlit', substring);
        }
        // code for integers
        // emit('intlit', line.substring(start, pos));
      } else {
        error("Illegal character: " + line[pos], {
          line: lineNumber,
          col: pos + 1
        });
        pos++;
      }

    }

  }
}