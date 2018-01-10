define(["require", "exports", "jquery", "./HTMLRenderer"], function (require, exports, $, HTMLRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DrawingDisplay extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new DrawingDisplay object and its sub-modules.
         * @param  {JQuery}         parentNode Parent node owning current instance.
         * @param  {RubEns}         app        Related app instance.
         * @return {DrawingDisplay}            Fresh instance of DrawingDisplay.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "drawing_display";
            /**
             * Event handler for document changes.
             */
            this.documentChangedHandler = {
                eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
                callback: (_) => { this.updateCanvasContainerNode(); }
            };
            this.createRootNode();
            this.app = app;
            app.eventManager.registerEventHandler(this.documentChangedHandler);
            this.createCanvasContainerNode();
            this.updateCanvasContainerNode();
        }
        /**
         * Create and initialize the canvas container node.
         *
         * @author Camille Gobert
         */
        createCanvasContainerNode() {
            let canvasContainer = $("<div>");
            canvasContainer.attr("id", "canvas_container");
            this.canvasContainer = canvasContainer;
            this.rootNode.append(canvasContainer);
        }
        /**
         * Create and initialize all required canvases, and append them to the canvas container.
         * If there is no current document, this method only empties the canvas container.
         *
         * @author Camille Gobert
         */
        updateCanvasContainerNode() {
            this.canvasContainer.empty();
            let document = this.app.document;
            if (!document) {
                return;
            }
            this.canvasContainer.append(document.imageWorkspace.drawingCanvas.canvas);
            this.canvasContainer.append(document.imageWorkspace.selectionCanvas.canvas);
        }
    }
    exports.DrawingDisplay = DrawingDisplay;
});
