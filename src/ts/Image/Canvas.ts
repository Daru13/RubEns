import * as $ from "jquery";
import { ImageFormat } from "./ImageFormat"
import { EventManager } from "../EventManager";


/**
 * This class abstracts an HTML5 canvas.
 * The canvas is not displayed in the screen.
 * To have a displayable Canvas, see DisplayableCanvas.
 */
export class Canvas {

    /**
     * The canvas HTML node.
     */
    canvas: HTMLCanvasElement;

    /**
     * Canvas width, i.e. width of its content.
     */
    width: number;

    /**
     * Canvas height, i.e. height of its content.
     */
    height: number;

    /**
     * The event manager.
     */
    protected eventManager: EventManager;

    /**
     * The 2D context of the canvas.
     */
    private canvas2DContext: CanvasRenderingContext2D;


    /**
     * Event handler for document resized.
     */
    protected documentResizedHandler = {
        eventTypes: ["rubens_documentResized"],
        callback  : (event) => {
            let newWidth  = event.detail.newWidth;
            let newHeight = event.detail.newHeight;

            this.updateDimensions(newWidth, newHeight);
        }
    };


    /**
     * Instanciates and initializes a new Canvas object.
     * @param  {number}       width        Width of the canvas (content).
     * @param  {number}       height       Height of the canvas (content).
     * @param  {EventManager} eventManager The event manager.
     * @return {Canvas}                    Fresh instance of Canvas.
     *
     * @author Camille Gobert
     */
    constructor (width: number, height: number, eventManager: EventManager) {
        this.width        = width;
        this.height       = height;
        this.eventManager = eventManager;

        eventManager.registerEventHandler(this.documentResizedHandler);
        this.createCanvasNode();
    }


    /**
     * Create the HTML canvas node.
     *
     * @author Camille Gobert
     */
    createCanvasNode() {
        let canvas = $("<canvas>");

        this.canvas = <HTMLCanvasElement> canvas[0];
        this.canvas2DContext = this.canvas.getContext("2d");

        canvas.attr("width", this.width + "px");
        canvas.attr("height", this.height + "px");
        this.updateDimensions(this.width, this.height);
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
     * Update the canvas dimensions.
     * It only updates the internal dimensions
     * , HTML node and CSS dimensions.
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
        canvas.attr("width" , width + "px");
        canvas.attr("height", height + "px");
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
     * @param {HTMLImageElement} image The image to import.
     *
     * @author Mathieu Fehr
     */
    importImage (image: HTMLImageElement) {
        this.canvas2DContext.drawImage(image, 0, 0);
    }


}
