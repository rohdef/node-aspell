const aspell = require("../aspell.js");

const errorHandler = function(chuck) {
  done.fail("The spell checker threw an error [" + chunk + "]");
};
const emitterHandler = function(emitter, done, resultHandler) {
  emitter
      .on("error", errorHandler)
      .on("result", resultHandler)
      .on("end", function() {
        done();
      });
};

describe("When searching for simple spelling errors", function() {
  it("it should not find any on a single correctly spelled workd", function(done) {
    var emitter = aspell("fiction");

    emitterHandler(emitter, done, function(result) {
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "misspelling"})
      );
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "unknown"})
      );
    });
  });

  it("suggests corrections to a misspelled word", function(done) {
    var emitter = aspell("errrs");

    emitterHandler(emitter, done, function(result) {
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "ok"})
      );
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "unknown"})
      );
    });
  });

  it("it should not fail on 'methusalemgenet'", function(done) {
    var emitter = aspell("methusalemgenet");

    emitterHandler(emitter, done, function(result) {
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "ok"})
      );
      expect(result).not.toEqual(
        jasmine.objectContaining({type: "unknown"})
      );
    });
  });
});

describe("When configuring terse mode", function() {
  var results;

  beforeEach(function() {
    aspell.terse = true;
    results = [];
  });

  it("it should not output 'ok' messages when on", function(done) {
    var emitter = aspell("correct");

    emitter
      .on("error", errorHandler)
      .on("result", function(result) {
        results.push(result);
      })
      .on("end", function() {
        expect(results).not.toContain({ type: "ok"});

        done();
      });
  });

  it("it should output 'ok' messages when off", function(done) {
    aspell.terse = false;
    var emitter = aspell("error");

    emitter
      .on("error", errorHandler)
      .on("result", function(result) {
        results.push(result);
      })
      .on("end", function() {
        expect(results).toContain({ type: "ok"});

        done();
      });
  });
});
