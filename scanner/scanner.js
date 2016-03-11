var fs = require('fs');
var byline = require('byline');
var XRegExp = require('xregexp').XRegExp;
var error = require('../error');

var LETTER = XRegExp('[\\p{L}]');
var DIGIT = XRegExp('[\\p{Nd}]');
var WORD_CHAR = XRegExp('[\\p{L}\\p{Nd}_]');
var KEYWORDS = /^(?:var|while|and|or|not|true|false|return|for|each|if|then|else|in|both|less than|greater than|ava)$/;
var oneCharacterTokens = /[+\-*\/()\[\]{},:;=\<\>\%\@\.Ee\!]/;
var twoCharacterTokens = /<=|==|>=|!=|\+=|\-=|\*=|\/=|\+\+|\-\-|\^\^|::|\.\.|\->/;
var threeCharacterTokens = /...|\*\*\*/;
var FLOAT = /^(\.\d+|\d+(\.\d+)?)([Ee][+-]?\d+)?$/;
var stringTokens; // code for strings

module.exports = function(filename, callback) {
  var baseStream = fs.createReadStream(filename, { encoding: 'utf8' });
  baseStream.on('error', function(err) {
    return error(err);
  });

  var stream = byline(baseStream, { keepEmptyLines: true });
  var tokens = [];
  var linenumber = 0;
  stream.on('readable', function() {
    return scan(stream.read(), ++linenumber, tokens);
  });

  return stream.once('end', function() {
    tokens.push({
      kind: 'EOF',
      lexeme: 'EOF'
    });
    return callback(tokens);
  });
};

var scan = function (line, linNumber, tokens) {
  if (!line) {
    return;
  } else {
    var start = 0;
    var pos = 0;
    var emit = function (kind, lexeme) {
      tokens.push({ kind, lexeme: lexeme || kind, line: linNumber, col: start+1 });
    }
    var substring = "";

    while (true) {

      while (/\s/.test(line[pos])) {
        pos++;
      }

      start = pos;

      if (pos >= line.length) {
        break;
      }
      if (line[pos] === '/' && line[pos + 1] === '/') {
        break;
      }

      if (threeCharacterTokens.test(line.substring(pos, pos + 3))) {
        emit(line.substring(pos, pos + 3));
        pos += 3;
      } else if (twoCharacterTokens.test(line.substring(pos, pos + 2))) {
        emit(line.substring(pos, pos + 2));
        pos += 2;
      } else if (oneCharacterTokens.test(line[pos])) {
        emit(line[pos++]);
      } else if (LETTER.test(line[pos])) {
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
          console.log('floatlit');
          emit('floatlit', substring);
        }
        // code for integers
        // emit('intlit', line.substring(start, pos));
      } else {
        error("Illegal character: " + line[pos], {
          line: linenumber,
          col: pos + 1
        });
        pos++;
      }

    }
  }
}