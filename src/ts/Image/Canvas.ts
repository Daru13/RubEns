import { ImageFormat } from "./ImageFormat"
import { Point } from "../utils/Point";


/**
 * This class abstracts an HTML5 canvas.
 */
export class Canvas {

    /**
     * The HTML canvas node.
     */
    private canvas: HTMLCanvasElement  = null;

    /**
     * The 2D context of the canvas.
     */
    private canvas2DContext: CanvasRenderingContext2D = null;

    /**
     * The bounding rectangle of the canvas.
     */
    private canvasBoundingRect: ClientRect;


    /**
     * Basic constructor
     */
    constructor (canvas: HTMLCanvasElement) {
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext("2d");
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
    }


    /**
     * Get the pixel matrix of the related HTML canvas as an ImageData object.
     * @return {ImageData} Raw data of the canvas.
     *
     * @author Camille Gobert
     */
    getImageData () {
        return this.canvas2DContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
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
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
