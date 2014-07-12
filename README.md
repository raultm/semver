GITSV - GIT Semantic Versioning 
===============================

[![Build Status](https://travis-ci.org/raultm/semver.svg?branch=master)](https://travis-ci.org/raultm/semver)

Only a human can state that a software must declare a new semantic version, but this human can have a tool to ease this task. `gitsv` pretend to be a git approach to this tool base its functionality in git tags.

What `gitsv` do?
---------------

When you want declare a new version `gitsv` finds your last [semantic version](http://semver.org/), calculate the new version, create a commit changing the VERSION file and adding a tag with this the new version.

What can I do with `gitsv`?
-------------------------

You can declare your desire  of a new version, you must declare what type of version do you want Major, minor o patch. `gitsv` allows you to define a message to add to the commit that will be created.

What kind of version scheme need to use?
----------------------------------------

`gitsv` detects any kind of semantic version when the label doesn't have a dot in the prepend or the append. Let's see a table with different schemes you can use and the result after apply `gitsv`

|               | Major         | Minor         | Patch         |
|---------------|---------------|---------------|---------------|
| 0.1.0         | 1.0.0         | 0.2.0         | 0.1.1         |
| v1.3.7        | v2.0.0        | v1.4.0        | v1.3.8        |
| v2.5.2-master | v3.0.0-master | v2.6.0-master | v2.5.3-master |
| 3.0.0beta     | 4.0.0beta     | 3.1.0beta     | 3.0.0beta     |

 
How can I use it?
------------------

[Video - gitsv Example - Spanish Audio](https://www.youtube.com/watch?v=3iAhtwU6Gb8)

`gitsv` needs nodes to work. Its is easy to install and if you think is not as useful as you think is very easy to uninstall so try it!

Install

`sudo npm install -g git://github.com/raultm/semver`

Uninstall

`sudo npm -g rm gitsv`

Options
-M Apply Major version
-m Apply minor version
-p Apply patch version
-l "Commit  message"
-h Show help

Examples

`gitsv -M -l "Version with new API, new design & new core"`

`gitsv -m -l "Adding Stripe payments"`

`gitsv -p -l "Bugfix weird behavior in Email feature"`

VERSION file
------------
In each new version gitsv create or modify the VERSION file in the root folder.

In terms of security you must not allow to view this file, this version can help to unwanted attackers to know which exploits can use to use against your product.

But you can benefit from this file, you can know what version the software is even if you have deleted the git repo.

You can use it to avoid problems with css/js cache. Using hashing and adding a version param

```
<script type='text/javascript' src='https://project.com/js/app.js?version=a9jhgy7kl'/>
```

If the version hash change in each new semantic version you must not worry about users' cache anymore.

