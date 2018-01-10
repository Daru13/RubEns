import { RubEns } from "../../src/ts/RubEns";
import { RubEnsParameters } from "../../src/ts/RubEnsParameters";
import { RootLayout } from "../../src/ts/UI/RootLayout";

// Load various modules required by the testing environement
const assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.window = window;
global.$ = require('jquery');


describe("Test of the event manager:", function () {

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


    describe("Event manager:", function () {
        let dummyCounter = 0;
        let dummyEventHandler: EventHandler = {
            eventTypes: ["rubens_test"],
            callback: (_) => { dummyCounter++; },
            disabled: false
        };

        it("Should be listening for events", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.eventManager.isListening);

                done();
            });
        });

        it("Should allow to register an event handler", function (done) {
            JSDOMPromise.then(_ => {
                rubEns.eventManager.registerEventHandler(dummyEventHandler);
                assert(rubEns.eventManager.registeredHandlers.has("rubens_test"));
                assert(rubEns.eventManager.registeredHandlers.get("rubens_test").size === 1);

                done();
            });
        });

        it("Should trigger an event handler when conditions are fulfilled", function (done) {
            JSDOMPromise.then(_ => {
                let event = new Event("rubens_test");
                document.dispatchEvent(event);

                setTimeout(_ => {
                    assert(dummyCounter === 1);
                }, 20);

                done();
            });
        });

        it("Should ignore disabled event handlers", function (done) {
            JSDOMPromise.then(_ => {
                dummyEventHandler.disabled = true;

                let event = new Event("rubens_test");
                document.dispatchEvent(event);

                setTimeout(_ => {
                    assert(dummyCounter === 1 /* instead of 2 */);
                }, 20);

                done();
            });
        });

        it("Should allow to unregister an event handler", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.eventManager.registeredHandlers.get("rubens_test").size === 1);
                rubEns.eventManager.unregisterEventHandler(dummyEventHandler);
                assert(! rubEns.eventManager.registeredHandlers.has("rubens_test"));

                done();
            });
        });
    });
});
