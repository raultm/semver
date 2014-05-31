var assert = require("assert");
var semver = require("../autosemver.js");

describe('AutoSemver', function(){
  describe('matchTag', function(){
    it('should return false when empty value', function(){
      assert.equal('', semver.matchTag());
    })
  })
})
