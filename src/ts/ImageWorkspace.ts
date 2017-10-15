
import {Canvas} from "./Image/Canvas";


/**
 * The image workspace of the application
 */
export class ImageWorkspace {

    constructor() {
        this.drawingCanvas = null;
        this.workingCanvas = null;
        this.selectionCanvas = null;
        this.selection = null;
    }

    /**
     * Canvas used to display current image
     */
    drawingCanvas: Canvas;

    /**
     * Canvas used by tools to preview operations
     */
    workingCanvas: Canvas;

    /**
     * Canvas used to display the current selection in the Canvas
     */
    selectionCanvas: Canvas;

    /**
     * The current selection
     */
    selection: Uint8Array;
}