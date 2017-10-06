import { Canvas } from "./Image/Canvas";
import { DocumentParameters } from "./DocumentParameters";
import { ImageFormat } from "./Image/ImageFormat";
import { DrawingParameters } from "./DrawingTools/DrawingParameters";
import { DrawingTool } from "./DrawingTools/DrawingTool";
import { EllipseTool } from "./DrawingTools/EllipseTool";
import { EventManager } from "./UI/EventManager";

export class Document {
    drawingCanvas: Canvas;
    workingCanvas: Canvas;

    parameters: DocumentParameters;
    globalDrawingParameters: DrawingParameters;

    private currentDrawingTool: DrawingTool;

    //TODO: maybe remove this from this class
    eventManager: EventManager;

    constructor (parameters: DocumentParameters, eventManager: EventManager) {
        this.parameters   = parameters;
        this.eventManager = eventManager;

        // Create fresh canvases
        this.drawingCanvas = new Canvas(document.getElementById("drawing_canvas"));
        this.workingCanvas = new Canvas(document.getElementById("working_canvas"));

        // Set a tool
        // TODO: handle tool management
        // this.currentDrawingTool = new EllipseTool(this.drawingCanvas, this.workingCanvas);
    }

    createCanvases (canvas) {
        this.drawingCanvas = new Canvas(canvas);
        this.currentDrawingTool.drawingCanvas = this.drawingCanvas;
    }

    /**
     * Export the current image in png format
     *
     * @author Mathieu Fehr
     */
    exportImage () {
        this.drawingCanvas.exportImage(ImageFormat.png,this.parameters.title);
    }


    /**
     * Ask the user for an image, and load it
     *
     * @author Mathieu Fehr
     */
    importImage () {
        // The node is used to trigger the image loading
        let inputNode = document.createElement("input");
        inputNode.setAttribute("type", "file");

        // function to call when the image is loaded in the html node
        inputNode.addEventListener("change", () => this.onImageLoad(inputNode));

        inputNode.style.display = "none";
        document.body.appendChild(inputNode);

        inputNode.click();
    }

    /**
     * Action to do when an image is loaded by the user in an html input node
     *
     * @param { HTMLInputElement } inputNode    The html input node, which has a file loaded
     *
     * @author Mathieu Fehr
     */
    private onImageLoad(inputNode: HTMLInputElement) {
        let file = inputNode.files[0];
        let imageType = /image.*/;

        if(file && file.type.match(imageType)) {
            this.copyFileImageToCanvas(file, () => (document.body.removeChild(inputNode)));
        } else {
            // TODO remove alert and create proper error blocks
            alert("Error while loading image");
        }
    }

    /**
     * Copy a loaded and correct image file in a canvas.
     *
     * @param {File} file                       The loaded file
     * @param {HTMLInputElement} onCopyEnd      The callback function
     *
     * @author Mathieu Fehr
     */
    private copyFileImageToCanvas(file: File, onCopyEnd: () => void) {
        let self = this;
        let reader = new FileReader();

        reader.addEventListener("load", function(){
            let img = new Image();
            img.addEventListener("load", function() {
                // TODO change interface when image size is not the same
                self.parameters.height = img.height;
                self.parameters.width = img.width;
                self.drawingCanvas.importImage(img);
                onCopyEnd();
            });
            img.src = reader.result;
        });

        reader.readAsDataURL(file);
    }

    /**
     * Updates the current drawing tool and the related event handlers.
     * @param tool  The new drawing tool.
     *
     * @author Camille Gobert
     */
    setCurrentDrawingTool (tool: DrawingTool) {
        this.currentDrawingTool.unregisterEvents(this.eventManager);

        this.currentDrawingTool = tool;
        tool.registerEvents(this.eventManager);
    }
}
