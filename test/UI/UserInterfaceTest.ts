import { RubEns } from "../../src/ts/RubEns";
import { RubEnsParameters } from "../../src/ts/RubEnsParameters";
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


    describe("Root layout:", function () {

        it("Should create a root layout", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout);
                assert(rubEns.rootLayout.rootNode);

                done();
            });
        });

        it("Should create a main menu", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu);
                assert(rubEns.rootLayout.mainMenu.rootNode);

                done();
            });
        });

        it("Should create a drawing display", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.drawingDisplay);
                assert(rubEns.rootLayout.drawingDisplay.rootNode);

                done();
            });
        });

        it("Should create a sidebar", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar);
                assert(rubEns.rootLayout.sidebar.rootNode);

                done();
            });
        });

        it("Should create a status bar", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.statusBar);
                assert(rubEns.rootLayout.statusBar.rootNode);

                done();
            });
        });

        it("Should create a tool menu", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.toolMenu);
                assert(rubEns.rootLayout.toolMenu.rootNode);

                assert(rubEns.rootLayout.toolMenu.toolSelectionMenu);
                assert(rubEns.rootLayout.toolMenu.toolSelectionMenu.rootNode);

                done();
            });
        });
    });


    describe("Main menu:", function () {

        it("Should create a submenu for document actions", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu.documentActionsMenu);
                assert(rubEns.rootLayout.mainMenu.documentActionsMenu.rootNode);

                done();
            });
        });

        it("Should create an effect menu", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.mainMenu.effectMenu);
                assert(rubEns.rootLayout.mainMenu.effectMenu.rootNode);

                done();
            });
        });
    });


    describe("Sidebar:", function () {

        it("Should create a global parameter field", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.globalParametersField);
                assert(rubEns.rootLayout.sidebar.globalParametersField.rootNode);

                done();
            });
        });

        it("Should create a tool-related parameter field", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.currentToolParametersField);
                assert(rubEns.rootLayout.sidebar.currentToolParametersField.rootNode);

                done();
            });
        });

        it("Should create a history list", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.historyList);
                assert(rubEns.rootLayout.sidebar.historyList.rootNode);

                done();
            });
        });

        it("Should create a layer list", function (done) {
            JSDOMPromise.then(_ => {
                assert(rubEns.rootLayout.sidebar.layerList);
                assert(rubEns.rootLayout.sidebar.layerList.rootNode);

                done();
            });
        });
    });


    describe("Drawing display:", function () {

        it("Should contain zero or two canvases", function (done) {
            JSDOMPromise.then(_ => {
                let nb_html_canvases = $("#canvas_container").children().length;
                assert(nb_html_canvases === 0 || nb_html_canvases === 2);

                done();
            });
        });

        it("Should create two canvases when a document is created", function (done) {
            JSDOMPromise.then(_ => {
                rubEns.createEmptyDocument();

                setTimeout(_ => {
                    let nb_html_canvases = $("#canvas_container").children().length;
                    assert(nb_html_canvases === 2);
                }, 20);

                // Always failing if put in the timeout callback
                done();
            });
        });

        it("Should remove all canvases when a document is closed", function (done) {
            JSDOMPromise.then(_ => {
                rubEns.closeDocument();

                setTimeout(_ => {
                    let nb_html_canvases = $("#canvas_container").children().length;
                    assert(nb_html_canvases === 0);
                }, 20);

                // Always failing if put in the timeout callback
                done();
            });
        });
    });
});
