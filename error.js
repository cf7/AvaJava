//baseline code from Iki
// practicing branching

// string interpolation in javascript requires back-ticks around
// the template literals `${message}`
var error = function (message, location) {
    if (location && location.line) {
        message += ` at line ${location.line}`;
        if (location.col) {
            message += `, column ${location.col}`;
        }
    }
    if (!error.quiet) {
        console.log(`${message}`);
    }
    return error.count++;
};

error.quiet = false;
error.count = 0;
module.exports = error;
