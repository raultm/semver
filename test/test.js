var assert = require("assert");
var semver = require("../autosemver.js").autosemver;

describe('AutoSemver', function(){
    describe('matchTag', function(){
        it('should return false when empty value', function(){
            assert.equal('', semver.matchTagFromGitDescribe());
        });

        it('should return version 0.1.0-5-md5commit if versionString is the same', function(){
            assert.equal('0.1.0', semver.matchTagFromGitDescribe('0.1.0-5-md5commit').version);
        })

        it('should return object defining three attributes (major.minor.patch)', function(){
            var tag = semver.matchTagFromGitDescribe('0.1.0-5-md5commit');
            assert.equal('0.1.0', tag.version);
            assert.equal('0', tag.major);
            assert.equal('1', tag.minor);
            assert.equal('0', tag.patch);
        })


    })
})
