JavaScript base template
===============================================================================

Included libraries
-------------------------------------------------------------------------------

This template includes following libraries:

* lodash
* javascript
* moment
* grunt
* bootstrap
* mustache
* json2 for old browsers

Requirements
-------------------------------------------------------------------------------
* NodeJS
* NPM
* Bower
* Make

Getting started
-------------------------------------------------------------------------------

* Install Grunt globally

```bash
npm install -g grunt-cli
```

* Install node packages

```bash
npm install
```

* Install bower packages

```bash
bower install
```

* Run server

```bash
grunt
```

* Make a build

```bash
grunt build
```

* Lint code

```bash
grunt lint
```

Sublime Text Plugins
-------------------------------------------------------------------------------

* Make sure you have already installed Sublime Text Package Control.
* Press ⌘ + ⇧ + P.
* Type `jshint gutter` and press `enter`.
* Once installed, restart sublime and open the file you want to lint.
* Press ⌘ + ⇧ + j to lint the file.
* Optionally you may be interested in lint your code while editing, to achive that go to Tools > JSHint > Set Plugin Options and set lint_on_edit to true.

Create github page
-------------------------------------------------------------------------------
* Gihub page is built grabbing contents from examples directory and creating gh-pages branch with that.
* To achive that just run:

```bash
make
```

