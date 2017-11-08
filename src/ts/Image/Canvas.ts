import * as $ from "jquery";
import { ImageFormat } from "./ImageFormat"
import { Point } from "../utils/Point";


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
     * Basic constructor
     */
    constructor (width: number, height: number, id: string) {
        this.width  = width;
        this.height = height;
        this.id     = id;

        let canvas = $("<canvas>");
        canvas.attr("id", id);

        canvas.attr("width", width + "px");
        canvas.css("width", width + "px");
        canvas.attr("height", height + "px");
        canvas.css("height", height + "px");

        this.canvas             = <HTMLCanvasElement> canvas[0];
        this.canvas2DContext    = this.canvas.getContext("2d");
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
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
    importImage(image: HTMLImageElement) {
        this.canvas2DContext.drawImage(image,0,0);
    }


    /**
     * Compute and save the bounding rectangle of the HTML canvas.
     * This method should be called whenever the canvas changes in the DOM.
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
