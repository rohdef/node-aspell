const aspell = require("../aspell.js");

const emitterHandler = function(emitter, done, resultHandler) {
  emitter
      .on("error", function(chuck) {
        done.fail("The spell checker threw an error [" + chunk + "]");
      })
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
