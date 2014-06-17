#!/usr/bin/env node

//console.log(process.argv);
//console.log(process.cwd());

var semver = require('../index.js');
semver.clirun(process.argv, process.cwd());
