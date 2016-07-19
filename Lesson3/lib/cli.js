(function() {
  var colors, pkg, print;

  colors = require("colors");

  pkg = require("../package.json");

  exports.print = print = function(options) {
    if (options && options.message && typeof options.message === 'string') {
      return console.log("[", "node-cli".white, "]", options.message.toString().cyan);
    } else {
      throw new Error('no message defined to print!');
    }
  };

}).call(this);
