var fs = require('fs');
var byline = require('byline');
var XRegExp = require('xregexp');
var error = require('../error.js');

var LETTER = /[A-Za-z]/;
var DIGIT = /[0-9]/;
var WORD_CHAR = /[A-Za-z_]/;
var KEYWORDS = /^(?:var|while|and|or|function|not|true|false|return|for|each|if|then|else|in|of|both|ava|end|times|int|string|bool|float|list|type|when)$/;
var oneCharacterTokens = /["'+\-*\/()\[\]{},:;=\<\>\%\@\.\#]/; // add ! for factorial
var twoCharacterTokens = /<=|==|>=|!=|\+=|\-=|\*=|\/=|\+\+|\-\-|\^\^|::|\.\.|\->/;
var threeCharacterTokens = /\.\.\.|\*\*\*/;
var intlit = /^\d+$/;
var FLOAT = /(\.\d+|\d+(\.\d+)?)([Ee][+-]?(\d)+)?/;


module.exports = function(filename, callback) {

  var baseStream = fs.createReadStream(filename, { encoding: 'utf8' });
  baseStream.on('error', function(err) {
    return error(err);
  });

  var stream = byline(baseStream, { keepEmptyLines: true });
  var tokens = [];
  var linenumber = 1;

  stream.on('readable', function() {
    return scan(stream.read(), linenumber++, tokens);
  });

  return stream.once('end', function() {
    tokens.push({
      kind: 'EOF',
      lexeme: 'EOF'
    });
    return callback(processMultiLineComments(tokens));
  });
};

var containsInterpolation = function (string) {
  var start = 0;
  var pos = 0;
  var containsInterp = false;
  var interpString = "";
  while (pos < string.length) {
    if (string[pos] === "#" && string[pos + 1] === "{") {
      start = pos;
      while (pos < string.length && string[pos] !== "}") {
        pos++;
      }
      if (pos + 1 >= string.length && string[pos] !== "}") {
        break;
      } else {
        pos++;
        interpString = string.substring(start, pos);
        containsInterp = true;
      }
    } else {
      pos++;
    }
  }
  return containsInterp;
}

var processStringInterpolation = function (string, linenumber, strStart, tokens) {
  var start = 0;
  var pos = 0;
  var front = "";
  var rest = "";
  var interpString = "";
  console.log("inside processString: " + string);
  while (pos < string.length) {
    if (string[pos] === "#" && string[pos + 1] === "{") {
      start = pos;
      while (pos < string.length && string[pos] !== "}") {
        pos++;
      }
      pos++;
      front = string.substring(0, start);
      rest = string.substring(pos, string.length);
      interpString = string.substring(start, pos);
    } else {
      pos++;
    }
  }
  interpString = interpString.replace("#{", "");
  interpString = interpString.replace("}", "");

  var spaces = strStart + front.length + 2;
  tokens.push({ kind: 'stringlit', lexeme: front + "\"", line: linenumber, col: strStart });
  tokens.push({ kind: '+', lexeme: '+', line: linenumber, col: spaces }); // add a space between chars
  tokens.push({ kind: 'id', lexeme: interpString, line: linenumber, col: spaces + 2 });
  tokens.push({ kind: '+', lexeme: '+', line: linenumber, col: spaces + 2 + interpString.length + 1 });
  tokens.push({ kind: 'stringlit', lexeme: "\"" + rest, line: linenumber, col: spaces + 2 + interpString.length + 3 });
}

var processMultiLineComments = function (tokens) {
    var index = 0;
    var inside = false;
    var firstIndex = 0;
    var numElementsToDelete = 0;
    while (index < tokens.length) {
      if (tokens[index].lexeme === "***" && !inside) {
        firstIndex = index;
        numElementsToDelete++;
        inside = true;
        index++;
      }
      if (tokens[index].lexeme === "***" && inside) {
        tokens.splice(firstIndex, numElementsToDelete + 1);
        index = 0;
        inside = false;
        firstIndex = 0;
        numElementsToDelete = 0;
      } else {
        if (inside) {
          numElementsToDelete++;
        }
        index++;
      }
    }
  return tokens;
}

var scan = function (line, lineNumber, tokens) {
  if (!line) {
    return;
  } else {
    var start = 0;
    var pos = 0;

    var emit = function (kind, lexeme) {
      tokens.push({ kind: kind, lexeme: (lexeme || kind), line: lineNumber, col: start+1 });
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
        var string = "";
        var encounteredString = false;
        if (/["']/.test(line[pos])) {
          encounteredString = true;
          var quoteType = new RegExp(line[pos]);
          console.log("quoteType: " + quoteType);
          start = pos;
          pos++
          while (!quoteType.test(line[pos]) && pos < line.length) {
            pos++;
          }
          pos++;
          string = line.substring(start, pos);
          if (containsInterpolation(string)) {
            processStringInterpolation(string, lineNumber, start, tokens);
          } else {
            emit("stringlit", string);
            start = pos;
          }
        }
        if (oneCharacterTokens.test(line[pos])) {
          emit(line[pos]);
          pos++;
        }
      } else if (LETTER.test(line[pos])) {
        while (WORD_CHAR.test(line[pos]) && pos < line.length) {
          pos++;
        }
        word = line.substring(start, pos);
        emit((KEYWORDS.test(word) ? word : 'id'), word);
      } else if (DIGIT.test(line[pos])) {

        start = pos;
        pos++;

        while (!oneCharacterTokens.test(line[pos]) && !/\s/.test(line[pos]) && pos < line.length) {
          pos++;
        }

        var scientificNotation = false;
        if (/[+\-]/.test(line[pos])) {
          if (/[Ee]/.test(line[pos - 1]) && DIGIT.test(line[pos + 1])) {
            pos++;
            while (!oneCharacterTokens.test(line[pos]) && !/\s/.test(line[pos]) && pos < line.length) {
              pos++;
            }
          }
        }

        if (/[.]/.test(line[pos]) && DIGIT.test(line[pos + 1])) {
          pos++;
          while (!oneCharacterTokens.test(line[pos]) && !/\s/.test(line[pos]) && pos < line.length) {
              pos++;
          }
        }

        var substring = line.substring(start, pos);
        if (intlit.test(substring)) {
          emit('intlit', substring);
        } else {
          emit('floatlit', substring);
        } 

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