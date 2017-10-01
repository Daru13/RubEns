import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";

export class DrawingDisplay extends HTMLRenderer {
    protected rootNodeId = "drawing_display";

    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    createRootNode () {
        // Canvas container
        this.rootNode = $("<div>");
        this.rootNode.attr("id", this.rootNodeId);

        this.parentNode.append(this.rootNode);

        // Drawing canvas
        let drawingCanvas = $("<canvas>");
        drawingCanvas.attr("id", "drawing_canvas");

        drawingCanvas.width(800);
        drawingCanvas.height(600);

        this.rootNode.append(drawingCanvas);

        // Working canvas
        let workingCanvas = $("<canvas>");
        workingCanvas.attr("id", "working_canvas");

        workingCanvas.width(800);
        workingCanvas.height(600);

        this.rootNode.append(workingCanvas);
    }

    updateRootNode () {

    }
}
