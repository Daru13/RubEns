import { RubEns } from "../../src/ts/RubEns";
import { RubEnsParameters } from "../../src/ts/RubEnsParameters";
import { RootLayout } from "../../src/ts/UI/RootLayout";

// Load various modules required by the testing environement
const assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.window = window;
global.$ = require('jquery');


describe("Test of RubEns:", function () {

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
    before(function () {
        // Asynchronously load the index.html file for building the DOM
        JSDOMPromise = JSDOM.fromFile("./src/index.html", {})
            .then(loadedDOM => {
                global.window = loadedDOM.window;

                // Fix for the missing animation timers
                global.window.requestAnimationFrame = function (_: (_: number) => void) {};
                global.window.cancelAnimationFrame  = function (_: number) {};

                let defaultParameters = new RubEnsParameters();
                rubEns = new RubEns(defaultParameters);
            })
            .catch(error => {
                console.log("Error: JSDOM could not load index.html for setting up the test environement.");
                console.error(error);
            });
    });

    describe("Main application (RubEns):", function () {

        it("Should initialize the event manager", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.eventManager);

                done();
            });
        });

        it("Should instanciate the tools", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.tools && rubEns.tools.length > 0);

                done();
            });
        });

        it("Should create a new document if required, none otherwise", function (done) {
            JSDOMPromise.then(_ => {
                if (rubEns.parameters.createDocumentOnStartup) {
                    assert(rubEns.document);
                }
                else {
                    assert(! rubEns.document);
                }

                done();
            });
        });

        it("Should initialize the user interface", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout)

                done();
            });
        });
    });
});
