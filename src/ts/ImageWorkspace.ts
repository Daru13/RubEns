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
     * Apply the working canvas in the drawingCanvas.
     * When a tool want to apply an operation in the drawingCanvas, it should draw it in the
     * working canvas, and then call this function.
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
     * Instanciates and initializes a new ImageWorkspace object.
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
