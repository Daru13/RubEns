import {Canvas} from "./Image/Canvas";


/**
 * Workspace of a [[Document]] instance, managing the various canvases used to display and edit an image.
 *
 * This includes the preview canvas used by drawing tools and the current selection.
 */
export class ImageWorkspace {

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
    selection: Uint8Array;

    /**
     * Instanciates and initializes a new ImageWorkspace object.
     * @return {ImageWorkspace} Fresh instance of ImageWorkspace.
     *
     * @author Mathieu Fehr
     */
    constructor() {
        this.drawingCanvas = null;
        this.workingCanvas = null;
        this.selectionCanvas = null;
        this.selection = null;
    }
}
