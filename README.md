# RubEns [![Build Status](https://travis-ci.org/Daru13/RubEns.svg?branch=master)](https://travis-ci.org/Daru13/RubEns)

**RubEns is a web drawing and image editing app, written in [Typescript](https://www.typescriptlang.org/).**

It is developed as a software engineering course project by Camille Gobert,
Mathieu Fehr and Josselin Giet, during our studies at the [École Normale Supérieure](https://www.ens.fr/en/ens).

[**You can find the latest build online!**](https://daru13.github.io/RubEns/)


## Features

RubEns aims to offer most of the standard features found in image editing software, such as:

* Image import and export
* Shapes and free-hand drawing
* Selections
* Layers
* History
* Visual effects

Because of performance issues and limited development time, none of those features are very advanced,
since the goal of this project was to concentrate on clean code and team work. However, the app
is fully usable, and offers an open source web alternative for simple graphical work.


## Requirements

RubEns is a **pure client-side app**: the only requirement for using it is a modern web browser,
such as Firefox 57+ or Chrome 63+. Simply click the link above!

Please note that, because of web technologies (e.g. Javascript engines) performance limits and implementation choices (e.g. writing our own primitive drawing tools), you may experience some occasional lag. This mainly occurs on large images, for certain costly operations. We try our best to optimize our code to avoid this, but no guarantee :)!


## Development

The app is written in Typescript (2.6+), HTML 5 and CSS 3.
[You can find the source code documentation online!](https://daru13.github.io/RubEns/docs)

It also uses several external libraries and tools for development and testing purposes, and a few runtime libraries. The provided `Makefile` and `package.json` ease the setup, building and testing processes. You can find details about those below.


### Installing dependencies

Several libraries are required in order to compile and test RubEns, listed below. Some Javascript libraries are also required at runtime; they are automatically included to the build target by the building script. Details on version requirements can be found in `package.json`.

**Development dependencies**

* `typescript`
* `typedoc`
* `mocha`
* `ts-mocha`
* `jquery` and `@types/jquery`
* `jsdom`
* `jsdom-global`
* `canvas`
* `amd-loader`

**Runtime librairies** (see `src/js` directory)

* `jquery.js`
* `require.js`

We provide an easy-to-use setup script, which takes care of installing all dependencies you may need to develop and test RubEns. It requires [`npm`](https://www.npmjs.com/) and a C++11 compiler (for `canvas` package) to be installed and available on your path.

Then, simply run `make setup` to prepare the setup the development environement!

*Please note that even though most dependencies are installed as local packages, we did not manage to setup the testing framework without installing `typescript`, `ts-mocha` and `mocha` as global packages.*


### Compiling and testing

Once the environement is set up, the Makefile provides the following commands:

* `make build` will compile all the sources, and produce a standalone app in a `build` directory;
* `make doc` will produce a web docs for the full Typescript sources in a `docs` directory;
* `make test` will run the tests available in the `test` directory (using [`mocha`](https://mochajs.org/) framework).

In addition, you can also run `make` to run the three commands listed above, and `make clean` to remove any build or doc output.


### Guidelines

Arriving soon!
