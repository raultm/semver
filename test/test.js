var assert = require("assert");
var semver = require("../autosemver.js").autosemver;

describe('AutoSemver', function(){
    describe('getEmptyTagObject', function(){
        it('should return first version [0.1.0] propose by http://semver.org/ in the first question of the FAQ', function(){
            var tagObject = semver.getEmptyTagObject()
            assert.equal('0.1.0', tagObject.tag);
            assert.equal('0.1.0', tagObject.version);
            assert.equal('0', tagObject.major);
            assert.equal('1', tagObject.minor);
            assert.equal('0', tagObject.patch);
        });
    });


    describe('matchVersionTagFromGitDescribe', function(){
        it('should return false when empty value', function(){
            assert.equal('', semver.matchVersionTagFromGitDescribe());
        });

        it('should detect [tag, version, major, minor, patch] values from git describe result [0.1.0-5-md5commit]', function(){
            var tagObject = semver.matchVersionTagFromGitDescribe('0.1.0-5-md5commit');
            assert.equal('0.1.0', tagObject.tag);
            assert.equal('0.1.0', tagObject.version);
            assert.equal('0', tagObject.major);
            assert.equal('1', tagObject.minor);
            assert.equal('0', tagObject.patch);
        });

        it('should detect tag and version correctly even if tag has a prepend like "v" [v0.1.0-5-md5commit]', function(){
            var tagObject = semver.matchVersionTagFromGitDescribe('v0.1.0-5-md5commit');
            assert.equal('v0.1.0', tagObject.tag);
            assert.equal('0.1.0', tagObject.version);
        });

        it('should detect tag even if version has an append [v0.1.0alfa-5-md5commit]', function(){
            var tagObject = semver.matchVersionTagFromGitDescribe('v0.1.0alfa-5-md5commit');
            assert.equal('v0.1.0alfa', tagObject.tag);
            assert.equal('0.1.0', tagObject.version);
        });

        it('should detect tag even if version has an append, even if the append has a "-" [v0.1.0-alfa-5-md5commit]', function(){
            var tagObject = semver.matchVersionTagFromGitDescribe('v0.1.0-alfa-5-md5commit');
            assert.equal('v0.1.0-alfa', tagObject.tag);
            assert.equal('0.1.0', tagObject.version);
        });


    });

    describe('calculateNextVersion', function(){
        it('should increment patch number', function(){
            var currentVersion = semver.getEmptyTagObject();
            var tagObject = semver.calculateNextVersion(currentVersion);
            assert.equal('1', tagObject.patch);
        });

        it('should handle patch modification in version', function(){
            var currentVersion = semver.getEmptyTagObject();
            var tagObject = semver.calculateNextVersion(currentVersion);
            assert.equal('0.1.1', tagObject.version);
        });

        it('should handle version modification in tag', function(){
            var currentVersion = semver.getEmptyTagObject();
            var tagObject = semver.calculateNextVersion(currentVersion);
            assert.equal('0.1.1', tagObject.tag);
        });

        it('should manage minor change', function(){
            var currentVersion = semver.getEmptyTagObject();
            var tagObject = semver.calculateNextVersion(currentVersion, semver.MINOR);
            assert.equal('2', tagObject.minor);
            assert.equal('0.2.0', tagObject.tag);
            assert.equal('0.2.0', tagObject.version);
            assert.equal('0', tagObject.patch);
        });

        it('should manage minor change and reset patch to 0', function(){
            var currentVersion = semver.getEmptyTagObject();
            currentVersion.patch = 4;
            var tagObject = semver.calculateNextVersion(currentVersion, semver.MINOR);
            assert.equal('2', tagObject.minor);
            assert.equal('0.2.0', tagObject.tag);
            assert.equal('0.2.0', tagObject.version);
            assert.equal('0', tagObject.patch);
        });

        it('should manage major change, reseting minor & patch', function(){
            var currentVersion = semver.getEmptyTagObject();
            currentVersion.minor = 7;
            currentVersion.patch = 7;
            var tagObject = semver.calculateNextVersion(currentVersion, semver.MAJOR);
            assert.equal('1.0.0', tagObject.tag);
            assert.equal('1.0.0', tagObject.version);
            assert.equal('1', tagObject.major);
            assert.equal('0', tagObject.minor);
            assert.equal('0', tagObject.patch);
        });



    })
})
