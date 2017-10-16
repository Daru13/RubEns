import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";

export class DrawingDisplay extends HTMLRenderer {
    protected rootNodeId = "drawing_display";

    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    /**
     * Create all canvases in a common block element, itself appended to the root node.
     *
     * @author Camille Gobert
     */
    createRootNode () {
        // Canvas container
        this.rootNode = $("<div>");
        this.rootNode.attr("id", this.rootNodeId);

        this.parentNode.append(this.rootNode);

        // Drawing canvas
        let drawingCanvas = $("<canvas>");
        drawingCanvas.attr("id", "drawing_canvas");

        drawingCanvas.attr("width", "800px");
        drawingCanvas.attr("height", "600px");

        this.rootNode.append(drawingCanvas);

        // Working canvas
        let workingCanvas = $("<canvas>");
        workingCanvas.attr("id", "working_canvas");

        workingCanvas.attr("width", "800px");
        workingCanvas.attr("height", "600px");
        this.rootNode.append(workingCanvas);

        // Selection canvas
        let selectionCanvas = $("<canvas>");
        selectionCanvas.attr("id", "selection_canvas");

        selectionCanvas.attr("width", "800px");
        selectionCanvas.attr("height", "600px");
        this.rootNode.append(selectionCanvas);
    }

    updateRootNode () {

    }
}
