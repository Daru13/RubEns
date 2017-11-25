import { RubEns } from "../../src/ts/RubEns";
import { RubEnsParameters } from "../../src/ts/RubEnsParameters";
import { RootLayout } from "../../src/ts/UI/RootLayout";
import { MainMenu } from "../../src/ts/UI/MainMenu";
import { DrawingDisplay } from "../../src/ts/UI/DrawingDisplay"
import { Sidebar } from "../../src/ts/UI/Sidebar";
import { StatusBar } from "../../src/ts/UI/StatusBar";
import { EventHandler } from "../../src/ts/UI/EventHandler";
import { EventManager } from "../../src/ts/UI/EventManager";


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
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout);
                assert(rubEns.rootLayout.rootNode);
            });
        });

        it("Should create a main menu", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu);
                assert(rubEns.rootLayout.mainMenu.rootNode);
            });
        });

        it("Should create a drawing display", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.drawingDisplay);
                assert(rubEns.rootLayout.drawingDisplay.rootNode);
            });
        });

        it("Should create a sidebar", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar);
                assert(rubEns.rootLayout.sidebar.rootNode);
            });
        });

        it("Should create a status bar", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.statusBar);
                assert(rubEns.rootLayout.statusBar.rootNode);
            });
        });
    });


    describe("Main menu:", function () {

        it("Should create a submenu for document actions", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu.documentActionsMenu);
                assert(rubEns.rootLayout.mainMenu.documentActionsMenu.rootNode);
            });
        });

        it("Should create a submenu for tool selection", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu.toolSelectionMenu);
                assert(rubEns.rootLayout.mainMenu.toolSelectionMenu.rootNode);
            });
        });
    });


    describe("Sidebar:", function () {

        it("Should create a global parameter field", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.globalParametersField);
                assert(rubEns.rootLayout.sidebar.globalParametersField.rootNode);
            });
        });

        it("Should create a tool-local parameter field", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.currentToolParametersField);
                assert(rubEns.rootLayout.sidebar.currentToolParametersField.rootNode);
            });
        });
    });


    describe("Drawing display:", function () {

        it("Should contain zero or three canvases", function () {
            JSDOMPromise.then(_ => {
                let nb_html_canvases = $("#canvas_container").children().length;
                assert(nb_html_canvases === 0 || nb_html_canvases === 3);
            });
        });

        it("Should create three canvases when a document is created", function () {
            JSDOMPromise.then(_ => {
                rubEns.createEmptyDocument();

                // Simulate/handle event dispatch delay
                setTimeout(function () {
                    let nb_html_canvases = $("#canvas_container").children().length;
                    assert(nb_html_canvases === 3);
                }, 2);
            });
        });

        it("Should remove three canvases when a document is closed", function () {
            JSDOMPromise.then(_ => {
                rubEns.closeDocument();

                // Simulate/handle event dispatch delay
                setTimeout(function () {
                    let nb_html_canvases = $("#canvas_container").children().length;
                    assert(nb_html_canvases === 0);
                }, 2);
            });
        });
    });


    describe("Event manager:", function () {
        let dummyCounter = 0;
        let dummyEventHandler: EventHandler = {
            eventTypes: ["rubens_test"],
            selector: $(document),
            callback: (_) => { dummyCounter++; },
            disabled: false
        };

        it("Should be listening for events", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.eventManager.isListening);
            });
        });

        it("Should allow to register an event handler", function () {
            JSDOMPromise.then(_ => {
                rubEns.eventManager.registerEventHandler(dummyEventHandler);
                assert(rubEns.eventManager.registeredHandlers.has("rubens_test"));
                assert(rubEns.eventManager.registeredHandlers.get("rubens_test").size === 1);
            });
        });

        it("Should trigger an event handler when conditions are fulfilled", function () {
            JSDOMPromise.then(_ => {
                let event = new Event("rubens_test");
                document.dispatchEvent(event);

                // Attempt to simulate event bubbling delday...
                setTimeout(function() {
                    assert(dummyCounter === 1);
                }, 2);
            });
        });

        it("Should ignore disabled event handlers", function () {
            JSDOMPromise.then(_ => {
                dummyEventHandler.disabled = true;

                let event = new Event("rubens_test");
                document.dispatchEvent(event);

                // Attempt to simulate event bubbling delday...
                setTimeout(function() {
                    assert(dummyCounter === 1 /* not 2 */);
                }, 2);
            });
        });

        it("Should allow to unregister an event handler", function () {
            JSDOMPromise.then(_ => {
                assert(rubEns.eventManager.registeredHandlers.get("rubens_test").size === 1);
                rubEns.eventManager.unregisterEventHandler(dummyEventHandler);
                assert(! rubEns.eventManager.registeredHandlers.has("rubens_test"));
            });
        });
    });
});
