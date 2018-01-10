define(["require", "exports", "./Document", "./History", "./DocumentParameters", "./EventManager", "./SupportChecker", "./UI/RootLayout", "./Tools/LineTool", "./Tools/EllipseTool", "./Tools/RectangleTool", "./Tools/FreeHandTool", "./Tools/RectangleSelectionTool", "./Tools/MagicWandTool", "./Tools/BucketTool", "./Tools/EyeDropperTool", "./Tools/ZoomInTool", "./Tools/ZoomOutTool", "./Effects/InverseColorEffect", "./Effects/GrayscaleEffect", "./Effects/MeanBlurEffect", "./Effects/GaussianBlurEffect", "./Effects/SharpenEffect"], function (require, exports, Document_1, History_1, DocumentParameters_1, EventManager_1, SupportChecker_1, RootLayout_1, LineTool_1, EllipseTool_1, RectangleTool_1, FreeHandTool_1, RectangleSelectionTool_1, MagicWandTool_1, BucketTool_1, EyeDropperTool_1, ZoomInTool_1, ZoomOutTool_1, InverseColorEffect_1, GrayscaleEffect_1, MeanBlurEffect_1, GaussianBlurEffect_1, SharpenEffect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Most general class of the project, representing the whole application.
     *
     * It manages and bonds components shared by various parts of the app,
     * such as documents, UI elements, the event manager.
     */
    class RubEns {
        /**
         * Instanciates and initializes a new RubEns object.
         *
         * This method calls various intiialization functions defined in this class,
         * in order to setup various parts of the app (e.g. tools, UI, document).
         * @param  {RubEnsParameters} parameters Set of parameters to use.
         * @return {RubEns}                      Fresh instance of RubEns.
         *
         * @author Camille Gobert
         */
        constructor(parameters) {
            /**
             * Currently loaded document.
             */
            /*private*/ this.document = null;
            this.checkAPISupport();
            this.parameters = parameters;
            this.initEventManager();
            this.initTools();
            this.initEffects();
            this.initUserInterface();
            this.initDocument();
        }
        /**
         * Perform various checks to detect if all required features are avilable or not.
         *
         * @author Camille Gobert
         */
        checkAPISupport() {
            // TODO: change error message
            let APISupported = SupportChecker_1.SupportChecker.checkSupport();
            if (!APISupported) {
                alert("RubEns is not fully supported on this browser");
            }
        }
        /**
         * Create and set up the event manager, which starts listening for events.
         *
         * @author Camille Gobert
         */
        initEventManager() {
            // Start handling events in the UI
            this.eventManager = new EventManager_1.EventManager();
            this.eventManager.startListening();
            // Debug code
            this.eventManager.registerEventHandler({
                eventTypes: ["keypress"],
                selector: "html",
                callback: (e) => {
                    // TODO: prevent default behaviour without blocking
                    // e.preventDefault();
                    let ev = e;
                    if (ev.ctrlKey && ev.key.toLowerCase() == "e") {
                        this.document.exportImage();
                    }
                    if (ev.ctrlKey && ev.key.toLowerCase() == "i") {
                        this.document.importImage();
                    }
                    if (ev.ctrlKey && ev.key.toLowerCase() == "z") {
                        this.document.history.goToLatestStep();
                    }
                    if (ev.ctrlKey && ev.key.toLowerCase() == "y") {
                        this.document.history.goToNextStep();
                    }
                }
            });
        }
        /**
         * Initialize the list of available tools.
         * This method should save an instance of every exposed [[Tool]] object.
         *
         * @author Camille Gobert
         */
        initTools() {
            this.tools = [
                new LineTool_1.LineTool(),
                new EllipseTool_1.EllipseTool(),
                new RectangleTool_1.RectangleTool(),
                new FreeHandTool_1.FreeHandTool(),
                new RectangleSelectionTool_1.RectangleSelectionTool(),
                new MagicWandTool_1.MagicWandTool(),
                new BucketTool_1.BucketTool(),
                new EyeDropperTool_1.EyeDropperTool(),
                new ZoomInTool_1.ZoomInTool(),
                new ZoomOutTool_1.ZoomOutTool()
            ];
            this.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentCreated"],
                callback: (event) => {
                    let newDocument = event.detail.document;
                    for (let tool of this.tools) {
                        tool.documentParameters = newDocument.parameters;
                        tool.workspace = newDocument.imageWorkspace;
                    }
                }
            });
            this.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentClosed"],
                callback: (_) => {
                    for (let tool of this.tools) {
                        tool.documentParameters = undefined;
                        tool.workspace = undefined;
                    }
                }
            });
        }
        /**
         * Initialize the list of available effects.
         * This method should save an instance of every exposed [[Effect]] object.
         *
         * @author Camille Gobert
         */
        initEffects() {
            this.effects = [
                new InverseColorEffect_1.InverseColorEffect(),
                new GrayscaleEffect_1.GrayscaleEffect(),
                new MeanBlurEffect_1.MeanBlurEffect(),
                new GaussianBlurEffect_1.GaussianBlurEffect(),
                new SharpenEffect_1.SharpenEffect(),
            ];
            this.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentCreated"],
                callback: (event) => {
                    let newDocument = event.detail.document;
                    for (let effect of this.effects) {
                        effect.workspace = newDocument.imageWorkspace;
                    }
                }
            });
            this.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentClosed"],
                callback: (_) => {
                    for (let effect of this.effects) {
                        effect.workspace = undefined;
                    }
                }
            });
        }
        /**
         * Updates every saved [[Tool]] instance, to keep its state up to date.
         * As of now, simply updates the document parameters of every tool.
         *
         * @author Camille Gobert
         */
        updateTools() {
            // Update the reference to document parameters
            let newDocumentParameters = this.document.parameters;
            for (let tool of this.tools) {
                tool.documentParameters = newDocumentParameters;
            }
        }
        /**
         * Initialize the user interface.
         * Note that this method requires tools and document to already exist!
         *
         * @author Camille Gobert
         */
        initUserInterface() {
            this.rootLayout = new RootLayout_1.RootLayout($("body"), this);
            this.rootLayout.mainMenu.effectMenu.setEffects(this.effects);
            this.rootLayout.toolMenu.toolSelectionMenu.setTools(this.tools);
        }
        /**
         * Create a new, empty document, and set it as the current document.
         * If a document is already open, it calls the [[closeDocument]] method first.
         * @param  {DocumentParameters} parameters Optionnal document parameters.
         *
         * @author Camille Gobert
         */
        createEmptyDocument(parameters) {
            if (this.document) {
                this.closeDocument();
            }
            parameters = parameters || new DocumentParameters_1.DocumentParameters();
            this.document = new Document_1.Document(parameters, this.eventManager);
            // Notify that the document has changed
            EventManager_1.EventManager.spawnEvent("rubens_documentCreated", { document: this.document });
        }
        /**
         * Create a new document from a given image, and set it as the current document.
         * If a document is already open, it calls the [[closeDocument]] method first.
         *
         * Note: if document parameters are provided, its width and height will be overriden.
         * @param  {HTMLImageElement}   image      Initial content of the new document.
         * @param  {DocumentParameters} parameters Optionnal document parameters.
         *
         * @author Camille Gobert
         */
        createDocumentFromImage(image, parameters) {
            if (this.document) {
                this.closeDocument();
            }
            // Set the document dimensions from the image properties
            parameters = parameters || new DocumentParameters_1.DocumentParameters();
            parameters.width.value = image.width;
            parameters.height.value = image.height;
            this.document = new Document_1.Document(parameters, this.eventManager);
            // Set the initial content of the new document
            // We are sure that there is a selected layer at this point
            this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.importImage(image);
            // Notify that the document has changed
            EventManager_1.EventManager.spawnEvent("rubens_documentCreated", { document: this.document });
            // Update the workspace
            this.document.imageWorkspace.redrawDrawingLayers();
            // Update the History.
            // TODO: make this new step the first one.
            EventManager_1.EventManager.spawnEvent("rubens_historyApplyOnCanvas", { redo: function () { },
                undo: function () { } });
            this.document.history = new History_1.History(this.document, this.eventManager);
        }
        /**
         * Close the current document.
         * This method has no effect if there is no document currently opened.
         *
         * @author Camille Gobert
         */
        closeDocument() {
            if (!this.document) {
                return;
            }
            let currentTool = this.document.getCurrentTool();
            if (currentTool) {
                currentTool.unregisterEvents(this.eventManager);
            }
            this.document = undefined;
            // Notify that the document has changed
            EventManager_1.EventManager.spawnEvent("rubens_documentClosed", { document: this.document });
        }
        /**
         *
         * Initialize the current document the right way.
         *
         * @author Camille Gobert
         */
        initDocument() {
            if (this.parameters.createDocumentOnStartup) {
                this.createEmptyDocument(new DocumentParameters_1.DocumentParameters());
            }
        }
    }
    /**
     * Version of the application.
     */
    RubEns.version = "0.2";
    exports.RubEns = RubEns;
});
