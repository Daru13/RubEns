import { ImageFormat } from "./ImageFormat"
import { Point } from "../utils/Point";

export class Canvas {
    // Related canvas and its context
    private canvas          = null;
    private canvas2DContext = null;

    private canvasBoundingRect: ClientRect;

    constructor (canvas) {
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext("2d");
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
    }

    getImageData () {
        return this.canvas2DContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    setImageData (data: ImageData) {
        this.canvas2DContext.putImageData(data, 0, 0);
    }

    resize () {

    }

    /**
     * Export the current image in the specified format
     *
     * @param {ImageFormat} format  The format of the file.
     * @param {string} fileName     The name of the file, without its extension.
     *
     * @author Mathieu Fehr
     */
    exportImage (format : ImageFormat, fileName : string) {
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
     *
     * @param {Image} image The image to import
     *
     * @author Mathieu Fehr
     */
    importImage(image : HTMLImageElement) {
        this.canvas2DContext.drawImage(image,0,0);
    }


    private normalizeCoordinatesForCanvas (coordinates: Point) {
        let boundingRect = this.canvasBoundingRect;

        coordinates.x *= (boundingRect.right  - boundingRect.left) / this.canvas.width;
        coordinates.y *= (boundingRect.bottom - boundingRect.top)  / this.canvas.height;

        return coordinates;
    }

    getMouseEventCoordinates (event: MouseEvent) {
        let boundingRect = this.canvasBoundingRect;

        let mouseX = (event.clientX - boundingRect.left);
        let mouseY = (event.clientY - boundingRect.top);

        return this.normalizeCoordinatesForCanvas(new Point(mouseX, mouseY));
    }
}
