import { Canvas } from "./Image/Canvas";
import { SelectedArea } from "./Image/SelectedArea";


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
     * The shift used to draw selection border pixels.
     * This is used to animate the borders
     */
    selectionBorderColorShift: number;


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
     * The selection canvas is equal to the drawing canvas, where the pixels selected have alpha = 0.
     * The selection hull is colored to distinguish the pixels selected.
     *
     * @author Mathieu Fehr
     */
    displaySelection(selection: SelectedArea) {
        let imageData = this.drawingCanvas.getImageData();

        selection.data.forEach((value, index) => {
            let x = index % this.width;
            let y = Math.floor(index / this.width);

            // If the pixel is selected, we make it invisible in this canvas
            if(value !== 0) {
                imageData.data[4 * (y * this.width + x) + 3] = 0;
                return;
            }

            // If the pixel is invisible in the image, we set the corresponding selection pixel
            // to the background value, so drawings will only be displayed in the selection.
            // TODO stop hardcoding the color of the background
            if(imageData.data[4 * (y * this.width + x) + 3] === 0) {
                imageData.data[4 * (y * this.width + x)    ] = 211;
                imageData.data[4 * (y * this.width + x) + 1] = 211;
                imageData.data[4 * (y * this.width + x) + 2] = 211;
                imageData.data[4 * (y * this.width + x) + 3] = 255;
            }

            if(x === 0 || y === 0 || x === this.width-1 || y === this.height-1) {
                return;
            }

            // We draw the selection hull
            for(let i = y-1; i <= y+1; i++) {
                for(let j = x-1; j <= x+1; j++) {
                    if(selection.data[i * this.width + j] !== 0) {
                        let greyColor = Math.floor(((x + y + this.selectionBorderColorShift) % 10) / 5) * 255;
                        imageData.data[4 * (y * this.width + x)    ] = greyColor;
                        imageData.data[4 * (y * this.width + x) + 1] = greyColor;
                        imageData.data[4 * (y * this.width + x) + 2] = greyColor;
                        imageData.data[4 * (y * this.width + x) + 3] = 255;
                        return;
                    }
                }
            }
        });

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
        this.selectionBorderColorShift = 0;

        // The selection is redrawn 5 times per seconds, to show an animation
        setInterval(() => {
            this.selectionBorderColorShift+=3;
            this.selectionBorderColorShift %= 10;
            this.displaySelection(this.selectedArea);
        } ,200);
    }
}
