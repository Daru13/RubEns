import { RubEns } from "../../src/ts/RubEns";
import { RubEnsParameters } from "../../src/ts/RubEnsParameters";
import { RootLayout } from "../../src/ts/UI/RootLayout";

// Load various modules required by the testing environement
const assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.window = window;
global.$ = require('jquery');


describe("Test of the user interface:", function () {

    let JSDOMPromise: Promise;
    let rubEns: RubEns;

    /**
     * Create a RubEns app, and let it initializes the UI.
     * It is only done once, as it is not modified in the following tests.
     *
     * In order to have the code working, it must first setup a testing environement
     * which supplies an expected DOM, i.e. a DOM built from the index.html file,
     * which is assumed to be loaded by the browser before any script loads otherwise.
     *
     * Since it is fully asynchronous, every test relies on a promise,
     * which ensures the DOM and the app have been properly loaded.
     */
    before(function() {
        // Asynchronously load the index.html file for building the DOM
        JSDOMPromise = JSDOM.fromFile("./src/index.html", {})
            .then(loadedDOM => {
                global.window = loadedDOM.window;

                let defaultParameters = new RubEnsParameters();
                rubEns = new RubEns(defaultParameters);
            })
            .catch(error => {
                console.log("Error: JSDOM could not load index.html for setting up the test environement.");
                // console.log(error);
            });
    });

    describe("Root layout:", function () {

        it("Should create a root layout", function () {
            JSDOMPromise = JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout);
                assert(rubEns.rootLayout.rootNode);
            });
        });

        it("Should create a main menu", function () {
            JSDOMPromise = JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu);
                assert(rubEns.rootLayout.mainMenu.rootNode);
            });
        });

        it("Should create a drawing display", function () {
            JSDOMPromise = JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.drawingDisplay);
                assert(rubEns.rootLayout.drawingDisplay.rootNode);
            });
        });

        it("Should create a sidebar", function () {
            JSDOMPromise = JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar);
                assert(rubEns.rootLayout.sidebar.rootNode);
            });
        });

        it("Should create a status bar", function () {
            JSDOMPromise = JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.statusBar);
                assert(rubEns.rootLayout.statusBar.rootNode);
            });
        });
    });
});
