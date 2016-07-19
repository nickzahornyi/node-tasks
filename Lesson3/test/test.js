(function() {
  var assert, cli;
  assert = require("assert");
  cli = require("../lib/cli");

  describe("cli", function() {

      it ("should throw an error when empty options", function() {
        assert.throws((function() {
            return cli.print().should.equal(error);
        }), Error);
      });

      it ("should print insert message", function() {
        assert.throws((function() {
          return cli.print(hello).should.equal('hello');
        }), Error);
      });
  });

}).call(this);
