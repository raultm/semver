var assert = require("assert");
var semver = require("../autosemver.js").autosemver;
console.log(semver);

describe('AutoSemver', function(){
  describe('matchTag', function(){
    it('should return false when empty value', function(){
      assert.equal('', semver.matchTag());
    });
    
    it('should return version if founded', function(){
      assert.equal('0.1.0', semver.matchTag('0.1.0'));
    })
  })
})
