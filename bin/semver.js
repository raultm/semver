#!/usr/bin/env node

var semver = require('../index.js');
semver.clirun(process.argv, process.cwd());
console.log(process.argv);
console.log(process.cwd());
