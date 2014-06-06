SEMI AUTO SEMVER
----------------
[![Build Status](https://travis-ci.org/raultm/semver.svg?branch=master)](https://travis-ci.org/raultm/semver)

The idea is to manage semi automatically the versioning of a software product. 

Every software development has it owns lyfecicle. Handling the versioning system would help the devs to invest more time in the software itself.

The versioning involves some repetitive tasks. If we can develop a system than guide this tasks we'll get a profitable product.

How
----
I think the versioning by git tags could be easy to handle and don't affects the history of the repo.

Using the idea expose in [Semantic Version](http://semver.org/)

Tasks
-----
1. Get the last tag version `git describe`
2. Handle the version with regex `/^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/` [regex checker](http://regex101.com/r/fT7bX6)
3. Ask if the new version is major, minor or patch (prompt?)
4. Check README. If no diff encourage to fill in if major/minor
5. Check if exists Changelog, if no diff encourage to fill in if major/minor/patch. Maybe use commit messages as version changelof.
6. Add or modify a file VERSION with the new version. The dev can use this in his/her product.
7. Create new commit with these changes and add the tag.
8. Maybe we can ask if the dev want to pull to a specific remote

I started with gulpjs, but finally I realized that I don't need it, I can use only nodejs for my porpuse.

Alfa version

`node semver.js`


