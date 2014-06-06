var assert = require("assert");
var semver = require("../autosemver.js").autosemver;
var exec = require('sync-exec');
var sinon = require('sinon')

var tmpPath = '/tmp';
var dummyName = 'dummyproject';
var projectPath  = tmpPath + "/" + dummyName;

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



    });

    describe('getLastTag', function(){
        beforeEach(function(){
            exec('rm -rf ' + dummyName  , {cwd: tmpPath});
            exec('mkdir ' + dummyName   , {cwd: tmpPath});
            exec('git init'             , {cwd: projectPath});
            exec('git status'           , {cwd: projectPath});
            exec('echo text > test.txt' , {cwd: projectPath});
            exec('git add .'            , {cwd: projectPath});
            exec('git commit -m "First"', {cwd: projectPath});
            //exec('git tag v0.1.0 -m "First Beta release"'     , {cwd: '/tmp/dummyproject'});
        })

        it('should return false if no tag is founded', function(){
            assert.equal(false, semver.getLastTag(projectPath));
        });

        it('should return tag if exists at least one', function(){
            exec('git tag v0.1.0 -m "First Beta"' , {cwd: projectPath});
            var tagObject = semver.getLastTag(projectPath);
            assert.equal('v0.1.0', tagObject.tag);
        });

        it('should return last tag if exists at least two', function(){
            exec('git tag v0.1.0 -m "1st"' , {cwd: projectPath});
            exec('echo text > test2.txt'   , {cwd: projectPath});
            exec('git add .'               , {cwd: projectPath});
            exec('git commit -m "Second"'  , {cwd: projectPath});
            exec('git tag v0.1.1 -m "2nd"' , {cwd: projectPath});
            var tagObject = semver.getLastTag(projectPath);
            assert.equal('v0.1.1', tagObject.tag);
        });
    });

    describe('updateVersionFile', function(){
        beforeEach(function(){
            exec('rm -rf ' + dummyName  , {cwd: tmpPath});
            exec('mkdir ' + dummyName   , {cwd: tmpPath});
        })

        it('should return false if no cwd', function(){
            assert.equal(false, semver.updateVersionFile());
        });

        it('should return false if no tagObject.tag', function(){
            assert.equal(false, semver.updateVersionFile(projectPath));
        });

        it('should write VERSION file with new tag', function(){
            tag = 'v3.4.5betaa'
            tagObject = { tag: tag};
            semver.updateVersionFile(projectPath, tagObject);
            cat = exec("cat " + projectPath + "/VERSION");
            assert.equal(tag, cat.stdout);
        });


    });

    describe('applyNewTag', function(){
        it('should return false if no cwd Provided', function(){
            assert.equal(false, semver.applyNewTag());
        });

        it('should return false if no tagObject Provided', function(){
            assert.equal(false, semver.applyNewTag(projectPath));
        });

        it('should notify all process was ok', function(){
            var tagObject = semver.getEmptyTagObject();
            assert.equal(true, semver.applyNewTag(projectPath, tagObject));
        });

        it('should call updateVersionFile', function(){
            var tagObject = semver.getEmptyTagObject();
            var updateVersionFileStub = sinon.stub(semver, "updateVersionFile", function(){ return true; });
            semver.applyNewTag(projectPath, tagObject);
            assert.equal(true       , updateVersionFileStub.calledOnce);
            assert.equal(projectPath, updateVersionFileStub.lastCall.args[0]);
            assert.equal(tagObject  , updateVersionFileStub.lastCall.args[1]);
        });

    });

    describe('run', function(){
        it('should return false if no cwd', function(){
            assert.equal(false, semver.run());
        });
        it('should call getLastTag with cwd', function(){
            var getLastTagStub = sinon.spy(semver, "getLastTag");
            semver.run(projectPath);
            assert.equal(true       , getLastTagStub.calledOnce);
            assert.equal(projectPath, getLastTagStub.lastCall.args[0]);
        });

//        it('should call calculateNextVersion with tagObject', function(){
//            var tagObject = semver.getEmptyTagObject();
//            var calculateNextVersionStub = sinon.spy(semver, "calculateNextVersion");
//            semver.run(projectPath);
//            console.log(calculateNextVersionStub.lastCall.args);
//            assert.equal(true, calculateNextVersionStub.calledOnce);
//            assert.equal(tagObject.tag, calculateNextVersionStub.lastCall.args[0].tag);
//        });
//
//        it('should call applyNewTag with cwd and tagObject', function(){
//            var newTagObject = semver.calculateNextVersion(semver.getEmptyTagObject());
//            var applyNewTagStub = sinon.spy(semver, "applyNewTag", function(){ return true; });
//            semver.run(projectPath);
//            assert.equal(true, applyNewTagStub.calledOnce);
//            assert.equal(projectPath, applyNewTagStub.lastCall.args[0]);
//            assert.equal(newTagObject, applyNewTagStub.lastCall.args[1]);
//        });
    });


})