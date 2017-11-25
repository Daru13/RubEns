import * as $ from "jquery";
import { ImageFormat } from "./ImageFormat"
import { Point } from "../utils/Point";
import { EventManager } from "../UI/EventManager";


/**
 * This class abstracts an HTML5 canvas.
 */
export class Canvas {

    /**
     * The canvas node.
     */
    canvas: HTMLCanvasElement;

    width: number;

    height: number;

    id: string;

    /**
     * The 2D context of the canvas.
     */
    private canvas2DContext: CanvasRenderingContext2D;

    /**
     * The bounding rectangle of the canvas.
     */
    private canvasBoundingRect: ClientRect;

    /**
     * Reference to the application event manager.
     */
    eventManager: EventManager;

    /**
     * Event handler for window resized.
     */
    protected windowResizedHandler = {
        eventTypes: ["resize"],
        callback  : (_) => { this.updateBoundingRect(); }
    };

    /**
     * Event handler for document resized.
     */
    protected documentResizedHandler = {
        eventTypes: ["rubens_documentResized"],
        selector  : $(document),
        callback  : (event) => {
            let newWidth  = event.detail.newWidth;
            let newHeight = event.detail.newHeight;

            this.updateDimensions(newWidth, newHeight);
            this.updatePosition();
            this.updateBoundingRect();
        }
    };


    /**
     * Basic constructor
     */
    constructor (width: number, height: number, id: string, eventManager: EventManager) {
        this.width        = width;
        this.height       = height;
        this.id           = id;
        this.eventManager = eventManager;

        let canvas = $("<canvas>");
        canvas.attr("id", id);

        canvas.attr("width", width + "px");
        canvas.css("width", width + "px");
        canvas.attr("height", height + "px");
        canvas.css("height", height + "px");

        this.canvas             = <HTMLCanvasElement> canvas[0];
        this.canvas2DContext    = this.canvas.getContext("2d");
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();

        eventManager.registerEventHandler(this.windowResizedHandler);
        eventManager.registerEventHandler(this.documentResizedHandler);
    }


    /**
     * Get the pixel matrix of the related HTML canvas as an ImageData object.
     * @return {ImageData} Raw data of the canvas.
     *
     * @author Camille Gobert
     */
    getImageData () {
        return this.canvas2DContext.getImageData(0, 0, this.width, this.height);
    }


    /**
     * Set the pixel matrix of the related HTML canvas from an ImageData object.
     * @param {ImageData} data New canvas raw data.
     *
     * @author Camille Gobert
     */
    setImageData (data: ImageData) {
        this.canvas2DContext.putImageData(data, 0, 0);
    }


    /**
     * Clear the canvas by setting all the RGBA pixels to (0, 0, 0, 0).
     *
     * @author Camille Gobert
     */
    clear () {
        this.canvas2DContext.clearRect(0, 0, this.width, this.height);
    }


    /**
     * Export the current image in the specified format
     * @param {ImageFormat} format    The format of the file.
     * @param {string}      fileName  The name of the file, without its extension.
     *
     * @author Mathieu Fehr
     */
    exportImage (format: ImageFormat, fileName: string) {
        // TODO add test to travis
        // The html node is used to trigger the download from the web page
        let htmlNode = document.createElement("a");
        htmlNode.setAttribute("href",this.canvas.toDataURL("image/" + format));
        htmlNode.setAttribute("download", fileName + "." + format);

        htmlNode.style.display = "none";
        document.body.appendChild(htmlNode);

        htmlNode.click();

        document.body.removeChild(htmlNode);
    }


    /**
     * Import the image in the specified format.
     * The image should have the same size as the canvas.
     * @param {HTMLImageElement} image The image to import
     *
     * @author Mathieu Fehr
     */
    importImage (image: HTMLImageElement) {
        this.canvas2DContext.drawImage(image,0,0);
    }


    /**
     * Update the canvas dimensions.
     * It updates the internal, HTML node and CSS dimensions.
     * @param {number} width  New width.
     * @param {number} height New height.
     *
     * @author Camille Gobert
     */
    updateDimensions (width: number, height: number) {
        // Set the internal dimensions
        this.width  = width;
        this.height = height;

        let canvas = $(this.canvas);

        // Set the HTML node dimensions
        canvas.attr("width" , width);
        canvas.attr("height", height);

        // Set the CSS dimensions (via `style` attribute)
        let widthAsString  = width  + "px";
        let heightAsString = height + "px";

        canvas.css("width" , widthAsString);
        canvas.css("height", heightAsString);
    }


    /**
     * Update the canvas positions.
     *
     * @author Camille Gobert
     */
    updatePosition () {
        let canvas = $(this.canvas);

        let marginLeftAsString = (- Math.floor(this.width  / 2)) + "px";
        let marginTopAsString  = (- Math.floor(this.height / 2)) + "px";

        // Set the CSS negative margins (for proper centering)
        canvas.css("margin-left", marginLeftAsString);
        canvas.css("margin-top" , marginTopAsString);
    }


    /**
     * Update the bounding rectangle of the canvas (from its HTML node).
     *
     * Note: this method relies on the dimensions and position of the HTML node.
     * Therfore, it should be called only *after* those properties have been updated!
     *
     * @author Camille Gobert
     */
    updateBoundingRect () {
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
    }


    /**
     * Get the position of a mouse event relative to the canvas,
     * @param  {MouseEnvet} event The mouse event
     * @return                    The position of the mouse event relative to the canvas.
     *
     * @author Camille Gobert
     */
    getMouseEventCoordinates (event: MouseEvent) {
        let boundingRect = this.canvasBoundingRect;

        let mouseX = (event.clientX - boundingRect.left);
        let mouseY = (event.clientY - boundingRect.top);

        let coordinates = new Point(mouseX, mouseY);

        coordinates.x *= (boundingRect.right  - boundingRect.left) / this.canvas.width;
        coordinates.y *= (boundingRect.bottom - boundingRect.top)  / this.canvas.height;

        return coordinates;
    }
}
