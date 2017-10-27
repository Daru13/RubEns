import { Canvas } from "./Image/Canvas";
import { SelectedArea } from "./Image/SelectedArea";
import {Point} from "./utils/Point";


/**
 * Workspace of a [[Document]] instance, managing the various canvases used to display and edit an image.
 *
 * This includes the preview canvas used by drawing tools and the current selection.
 */
export class ImageWorkspace {

    /**
     * The height of the canvases and the selection area
     */
    height: number;

    /**
     * the width of the canvases and the selection area
     */
    width: number;

    /**
     * Canvas used to display the actual image.
     */
    drawingCanvas: Canvas;

    /**
     * Canvas used to preview drawing operations made by the current tool.
     */
    workingCanvas: Canvas;

    /**
     * Canvas used to display the current selection in the Canvas
     */
    selectionCanvas: Canvas;

    /**
     * The current selection.
     */
    selectedArea: SelectedArea;


    /**
     * Apply the working canvas in the drawingCanvas.
     * When a tool want to apply an operation in the drawingCanvas, it should draw it in the
     * working canvas, and then call this function.
     *
     * @author Mathieu Fehr
     */
    applyWorkingCanvas() {
        let workingImageData = this.workingCanvas.getImageData();
        let drawingImageData = this.drawingCanvas.getImageData();

        // We select only the pixels that are in the selection
        this.selectedArea.data.forEach((value, index) => {
            //TODO add support for alpha different than 0 or 255
            if(value !== 0 && workingImageData.data[4 * index + 3] !== 0) {
                drawingImageData.data[4 * index] = workingImageData.data[4 * index];
                drawingImageData.data[4 * index + 1] = workingImageData.data[4 * index + 1];
                drawingImageData.data[4 * index + 2] = workingImageData.data[4 * index + 2];
                drawingImageData.data[4 * index + 3] = workingImageData.data[4 * index + 3];
            }
        });

        this.drawingCanvas.setImageData(drawingImageData);
        this.workingCanvas.clear();
    }

    /**
     * Display a representation of the selection given in parameters.
     *
     * @author Mathieu Fehr
     */
    displaySelection(selection: SelectedArea) {
        let imageData = new ImageData(this.width, this.height);
        imageData.data.fill(0);

        let selectionBorder : Array<Point> = [];

        selection.data.forEach((value, index) => {
            let x = index % this.width;
            let y = Math.floor(index / this.width);

            if(x === 0 || y === 0 || x === this.width-1 || y === this.height-1 || value !== 0) {
                return;
            }

            for(let i = y-1; i <= y+1; i++) {
                for(let j = x-1; j <= x+1; j++) {
                    if(selection.data[i * this.width + j] !== 0) {
                        selectionBorder.push(new Point(x,y));
                        return;
                    }
                }
            }
        });

        for(let p of selectionBorder) {
            imageData.data[4 * (p.y * this.width + p.x) + 3] = 255;
        }

        this.selectionCanvas.setImageData(imageData);
    }

    /**
     * Instantiates and initializes a new ImageWorkspace object.
     * @return {ImageWorkspace} Fresh instance of ImageWorkspace.
     *
     * @author Mathieu Fehr
     */
    constructor() {
        this.height = null;
        this.width = null;
        this.drawingCanvas = null;
        this.workingCanvas = null;
        this.selectionCanvas = null;
        this.selectedArea = null;
    }
}
