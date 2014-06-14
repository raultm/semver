var assert = require("assert");
var semverBase = require("../index.js");
var sinon = require('sinon');
var extend = require('util')._extend;
var semver;

var fs = require('fs');

var packageFileContent = fs.readFileSync('./package.json');
//var packageJson = JSON.parse(packageFile);

var tmpPath = '/tmp';
var dummyName = 'dummyproject';
var projectPath  = tmpPath + "/" + dummyName;

describe('AutoSemver', function(){

    beforeEach(function(){
        semver = extend({}, semverBase);
    })

    describe('Constants', function(){
        it('should have Major(M)', function(){
           assert.equal('M', semver.MAJOR);
        })

        it('should have Minor(m)', function(){
            assert.equal('m', semver.MINOR);
        })

        it('should have Patch(p)', function(){
            assert.equal('p', semver.PATCH);
        })

        it('should have defaultValues', function(){
            assert.equal(semver.PATCH, semver.defaultCLIValues.typeOfNewVersion);
            assert.equal('./', semver.defaultCLIValues.cwd);
        })
    });

    describe('clirun', function(){
        var parseArgvParamsStub;
        var runStub;
        beforeEach(function(){
            parseArgvParamsStub = sinon.stub(semver, "parseArgvParams", function(){ return true; });
            runStub = sinon.stub(semver, "run", function(){ return true; });
        })
        it('should call parseArgvParams', function(){
            semver.clirun();
            assert.equal(true       , parseArgvParamsStub.calledOnce);
        })

        it('should call run', function(){
            semver.clirun();
            assert.equal(true       , runStub.calledOnce);
        })
    })

    describe('run', function(){
        var getLastTagStub;
        var calculateNextVersionSpy;
        var applyNewTagStub;
        beforeEach(function(){
            getLastTagStub = sinon.stub(semver, "getLastTag", function(cwd){ return semver.getEmptyTagObject(); });
            calculateNextVersionSpy = sinon.spy(semver, "calculateNextVersion");
            applyNewTagStub = sinon.spy(semver, "applyNewTag", function(){ return true; });
            releaseNewTagStub = sinon.spy(semver, "releaseNewTag", function(){ return true; });
        })

        it('should return false if no cwd', function(){
            assert.equal(false, semver.run());
        });

        it('should call getLastTag with cwd', function(){
            semver.run(projectPath);
            assert.equal(true       , getLastTagStub.calledOnce);
            assert.equal(projectPath, getLastTagStub.lastCall.args[0]);
        });

        it('should call calculateNextVersion with tagObject', function(){
            semver.run(projectPath);
            assert.equal(true, calculateNextVersionSpy.calledOnce);
            assert.equal(semver.getEmptyTagObject().tag, calculateNextVersionSpy.lastCall.args[0].tag);
        });

        it('should call applyNewTag with cwd and tagObject', function(){
            var newTagObject = semver.calculateNextVersion(semver.getEmptyTagObject());
            semver.run(projectPath);
            assert.equal(true, applyNewTagStub.calledOnce);
            assert.equal(projectPath, applyNewTagStub.lastCall.args[0]);
            assert.equal(newTagObject.tag, applyNewTagStub.lastCall.args[1].tag);
        });

        it('should call releaseNewTag with cwd and tagObject', function(){
            var newTagObject = semver.calculateNextVersion(semver.getEmptyTagObject());
            semver.run(projectPath);
            assert.equal(true, releaseNewTagStub.calledOnce);
            assert.equal(projectPath, releaseNewTagStub.lastCall.args[0]);
            assert.equal(newTagObject.tag, releaseNewTagStub.lastCall.args[1].tag);
        });
    });

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
            semver.exec('rm -rf ' + dummyName  , tmpPath);
            semver.exec('mkdir ' + dummyName   , tmpPath);
            semver.exec('git init'             , projectPath);
            semver.exec('git status'           , projectPath);
            semver.exec('echo text > test.txt' , projectPath);
            semver.exec('git add .'            , projectPath);
            semver.exec('git commit -m "First"', projectPath);
        })

        it('should return false if no tag is founded', function(){
            assert.equal(false, semver.getLastTag(projectPath));
        });

        it('should return tag if exists at least one', function(){
            semver.exec('git tag v0.1.0 -m "First Beta"' , projectPath);
            var tagObject = semver.getLastTag(projectPath);
            assert.equal('v0.1.0', tagObject.tag);
        });

        it('should return last tag if exists at least two', function(){
            semver.exec('git tag v0.1.0 -m "1st"' , projectPath);
            semver.exec('echo text > test2.txt'   , projectPath);
            semver.exec('git add .'               , projectPath);
            semver.exec('git commit -m "Second"'  , projectPath);
            semver.exec('git tag v0.1.1 -m "2nd"' , projectPath);
            var tagObject = semver.getLastTag(projectPath);
            assert.equal('v0.1.1', tagObject.tag);
        });
    });

    describe('updateVersionFile', function(){
        beforeEach(function(){
            semver.exec('rm -rf ' + dummyName, tmpPath);
            semver.exec('mkdir ' + dummyName , tmpPath);
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
            cat = semver.exec("cat " + projectPath + "/VERSION");
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
            var updateVersionFileStub = sinon.stub(semver, "updateVersionFile", function(){ return true; });
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

    describe('releaseNewTag', function() {
        var execSpy;
        beforeEach(function(){
            semver.exec('rm -rf ' + dummyName  , tmpPath);
            semver.exec('mkdir ' + dummyName   , tmpPath);
            semver.exec('git init'             , projectPath);
            semver.exec('git status'           , projectPath);
            semver.exec('echo text > test.txt' , projectPath);
            semver.exec('git add .'            , projectPath);
            semver.exec('git commit -m "First"', projectPath);
            semver.exec('git tag 0.1.0 -m "First Beta release"', projectPath);
            semver.exec('echo v0.1.1 > VERSION' , projectPath);
            execSpy = sinon.spy(semver, "exec");
        });

        it('should return false if no cwd', function(){
            assert.equal(false, semver.releaseNewTag());
        });

        it('should return false if no tagObject', function(){
            assert.equal(false, semver.releaseNewTag(projectPath));
        });

        it('should create add/commit VERSION file to git repo ', function(){
            var newTagObject = semver.calculateNextVersion(semver.getEmptyTagObject());
            assert.equal(true, semver.releaseNewTag(projectPath, newTagObject));
            assert.equal(3, execSpy.callCount);
            assert.equal('git add VERSION', execSpy.args[0][0]);
            assert.equal('git commit -m "New Release"', execSpy.args[1][0]);
            assert.equal(0, execSpy.args[2][0].indexOf("git tag " + newTagObject.tag));
        });
    });

    describe('parseArgvParams', function(){
        it('should return false if no param', function(){
           assert.equal(false, semver.parseArgvParams());
        })

        it('should return semverDefaulCLIValues if empty argv', function(){
            assert.equal(semver.defaultCLIValues, semver.parseArgvParams([]));
        })

    });
})