var assert = require("assert");
var semver = require("../autosemver.js").autosemver;

describe('AutoSemver', function(){
    describe('matchVersionTagFromGitDescribe', function(){
        it('should return false when empty value', function(){
            assert.equal('', semver.matchVersionTagFromGitDescribe());
        });

        it('should detect [tag, version, major, minor, patch] values from git describe result 0.1.0-5-md5commit', function(){
            var describeObject = semver.matchVersionTagFromGitDescribe('0.1.0-5-md5commit');
            assert.equal('0.1.0', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
            assert.equal('0', describeObject.major);
            assert.equal('1', describeObject.minor);
            assert.equal('0', describeObject.patch);
        });

        it('should detect tag and version correctly even if tag has a prepend like "v" - v0.1.0-5-md5commit', function(){
            var describeObject = semver.matchVersionTagFromGitDescribe('v0.1.0-5-md5commit');
            assert.equal('v0.1.0', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });

        it('should detect tag even if version has an append v0.1.0alfa-5-md5commit', function(){
            var describeObject = semver.matchVersionTagFromGitDescribe('v0.1.0alfa-5-md5commit');
            assert.equal('v0.1.0alfa', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });

        it('should return object even if version has an append, even if the append has a "-" v0.1.0-alfa-5-md5commit', function(){
            var describeObject = semver.matchVersionTagFromGitDescribe('v0.1.0-alfa-5-md5commit');
            assert.equal('v0.1.0-alfa', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });


    })
})
