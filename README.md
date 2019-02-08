# search-ui-samples
A project to showcase custom components for the [Coveo Javascript Search Framework](https://github.com/coveo/search-ui).

## Requirements
Node JS => 8.0

## Setup

1. Fork / clone the repository.
2. `npm install` at the top of the repository.
3. `npm run watch` at the top of the repository.
4. Open `./docs/Index.html` in a browser. You should get a working, standard search page. Change the HTML file to test different components.

## Structure

The code is written in [typescript](http://www.typescriptlang.org/) and compiled using [webpack](https://webpack.github.io/)

Each component follow this structure:

* A `src` folder with the `Index.ts` file, which includes everything needed for the component.
* An `Index.html` file that showcases the custom component.
* (optional) A `sass` folder with an `Index.scss` file, which will be compiled as a standalone CSS script.
* (optional) A `tests` folder with tests for your custom component.
* (optional) A `readme.md` to briefly explain the component purpose.

Note:

This project is based of the [Coveo Search UI Seed](https://github.com/coveo/search-ui-seed) project, which is a starter project for a Covoe JavaScript Search Framework custom components library.

## Build task

* `npm run setup ` will copy the needed resources (`index.html`, `templates`, etc.) in the `docs` folder.
* `npm run css` will build the sass files into a css file in the `docs` folder.
* `npm run build` will run the `setup`, `css` task, then compile the typescript code.
* `npm run prod` will build the project to be ready for a commit and publishing the new components.

## Dev

`npm run watch` will start a [webpack dev server](https://webpack.js.org/concepts/). After it finishes, load [http://localhost:3000](http://localhost:3000) in a browser, and the `index.html` page should load.

Then, anytime you hit save in a typescript, sass or html file, the server will reload your application.

## Tests

* `npm run test` will execute the tests one time and give you the report
* `npm run watchTest` will watch changes and reexecute the tests and coverage when saving a file.

## To publish a new component

* Run `npm run prod`.
* Commit all the files
* Push

## Useful Visual Studio Code Extensions

If you are using Visual Studio Code, you can install the following extensions:

### [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

Shows inline linter problems in the code based on the `tslint.json` file. This will ensure that you are consistent with the formatting standards. 


