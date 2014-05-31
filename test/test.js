var assert = require("assert");
var semver = require("../autosemver.js").autosemver;

describe('AutoSemver', function(){
    describe('matchTag', function(){
        it('should return false when empty value', function(){
            assert.equal('', semver.matchTagFromGitDescribe());
        });

        it('should return version 0.1.0-5-md5commit if versionString is the same', function(){
            assert.equal('0.1.0', semver.matchTagFromGitDescribe('0.1.0-5-md5commit').version);
        });

        it('should return object defining three attributes (major.minor.patch)', function(){
            var describeObject = semver.matchTagFromGitDescribe('0.1.0-5-md5commit');
            assert.equal('0.1.0', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
            assert.equal('0', describeObject.major);
            assert.equal('1', describeObject.minor);
            assert.equal('0', describeObject.patch);
        });

        it('should return object even if version has a "v" prepend', function(){
            var describeObject = semver.matchTagFromGitDescribe('v0.1.0-5-md5commit');
            assert.equal('v0.1.0', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });

        it('should return object even if version has an append', function(){
            var describeObject = semver.matchTagFromGitDescribe('v0.1.0alfa-5-md5commit');
            assert.equal('v0.1.0alfa', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });

        it('should return object even if version has an append, even if the append has a -', function(){
            var describeObject = semver.matchTagFromGitDescribe('v0.1.0-alfa-5-md5commit');
            assert.equal('v0.1.0-alfa', describeObject.tag);
            assert.equal('0.1.0', describeObject.version);
        });


    })
})
