import { SelectedArea } from "./Image/SelectedArea";
import { Color } from "./utils/Color";
import { EventManager } from "./EventManager";
import { DisplayableCanvas } from "./Image/DisplayableCanvas";


/**
 * Workspace of a [[Document]] instance, managing the various canvases used to display and edit an image.
 *
 * This includes the preview canvas used by drawing tools and the current selection.
 */
export class ImageWorkspace {

    /**
     * The height of the canvases and the selection area.
     */
    height: number;

    /**
     * the width of the canvases and the selection area.
     */
    width: number;

    /**
     * Reference to the application event manager.
     */
    eventManager: EventManager;

    /**
     * Canvas used to display the actual image.
     */
    drawingCanvas: DisplayableCanvas;

    /**
     * Canvas used to preview drawing operations made by the current tool.
     */
    workingCanvas: DisplayableCanvas;

    /**
     * Canvas used to display the current selection in the Canvas
     */
    selectionCanvas: DisplayableCanvas;

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
     * The ID of the interval drawing the selection canvas.
     */
    selectionDrawingIntervalID: number;

    /**
     * The color of the drawingCanvas background.
     */
    drawingCanvasBgColor: Color = new Color(211, 211, 211, 255);


    /**
     * Instanciates and initializes a new ImageWorkspace object.
     * @param  {number}       width        Initial width of all canvases.
     * @param  {number}       height       Initial height of all canvases.
     * @param  {EventManager} eventManager Reference to the event manager.
     * @return {ImageWorkspace}            Fresh instance of ImageWorkspace.
     *
     * @author Mathieu Fehr, Camille Gobert
     */
    constructor(width: number, height: number, eventManager: EventManager) {
        this.width = width;
        this.height = height;
        this.eventManager = eventManager;

        this.createCanvases();
        this.initSelection();
    }


    /**
     * Initialize what is related to the selection (e.g. useful properties, selected area).
     *
     * @author Camille Gobert
     */
    initSelection() {
        this.selectionBorderColorShift = 0;
        this.selectionDrawingIntervalID = null;
        this.selectedArea = new SelectedArea(this.width, this.height);

        this.selectedArea.selectEverything();
    }


    /**
     * Create canvases abstracting the three related HTML nodes.
     *
     * @author Camille Gobert
     */
    createCanvases() {
        let width = this.width;
        let height = this.height;
        let eventManager = this.eventManager;

        this.drawingCanvas = new DisplayableCanvas(width, height, "drawing_canvas", eventManager);
        this.workingCanvas = new DisplayableCanvas(width, height, "working_canvas", eventManager);
        this.selectionCanvas = new DisplayableCanvas(width, height, "selection_canvas", eventManager);
    }


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
            if (value !== 0 && workingImageData.data[4 * index + 3] !== 0) {
                let dest = new Color(drawingImageData.data[4 * index],
                    drawingImageData.data[4 * index + 1],
                    drawingImageData.data[4 * index + 2],
                    drawingImageData.data[4 * index + 3]);

                let src = new Color(workingImageData.data[4 * index],
                    workingImageData.data[4 * index + 1],
                    workingImageData.data[4 * index + 2],
                    workingImageData.data[4 * index + 3]);

                let out = Color.blend(src, dest);

                drawingImageData.data[4 * index] = Math.round(out.red);
                drawingImageData.data[4 * index + 1] = Math.round(out.green);
                drawingImageData.data[4 * index + 2] = Math.round(out.blue);
                drawingImageData.data[4 * index + 3] = Math.round(out.alpha);
            }
        });

        this.drawingCanvas.setImageData(drawingImageData);
        this.workingCanvas.clear();
    }


    /**
     * Clear the selection.
     *
     * @author Mathieu Fehr
     */
    clearSelection() {
        if (this.selectionDrawingIntervalID !== null) {
            window.clearInterval(this.selectionDrawingIntervalID);
            this.selectionDrawingIntervalID = null;
        }

        this.selectedArea.data.fill(255);
        let imageData = this.selectionCanvas.getImageData();
        imageData.data.fill(0);
        this.selectionCanvas.setImageData(imageData);

    }


    /**
     * Display a representation of the selection given in parameters.
     * The selection canvas is equal to the drawing canvas, where the pixels selected have alpha = 0.
     * The selection hull is colored to distinguish the pixels selected.
     * @param {SelectedArea} selection The selected area instance to display.
     *
     * @author Mathieu Fehr
     */
    displaySelection(selection: SelectedArea) {
        let imageData = this.drawingCanvas.getImageData();

        if (this.selectionDrawingIntervalID === null) {
            this.selectionDrawingIntervalID = window.setInterval(() => {
                this.selectionBorderColorShift += 3;
                this.selectionBorderColorShift %= 10;
                this.displaySelection(this.selectedArea);
            }, 200);
        }

        selection.data.forEach((value, index) => {
            let x = index % this.width;
            let y = Math.floor(index / this.width);

            // If the pixel is selected, we make it invisible in this canvas
            if (value !== 0) {
                imageData.data[4 * (y * this.width + x) + 3] = 0;
                return;
            }

            // If the pixel is invisible in the image, we set the corresponding selection pixel
            // to the background value, so drawings will only be displayed in the selection.
            if (imageData.data[4 * (y * this.width + x) + 3] !== 255) {
                let red = imageData.data[4 * (y * this.width + x)];
                let green = imageData.data[4 * (y * this.width + x) + 1];
                let blue = imageData.data[4 * (y * this.width + x) + 2];
                let alpha = imageData.data[4 * (y * this.width + x) + 3];
                let color = new Color(red, green, blue, alpha);

                let outColor = Color.blend(color, this.drawingCanvasBgColor);

                imageData.data[4 * (y * this.width + x)] = outColor.red;
                imageData.data[4 * (y * this.width + x) + 1] = outColor.green;
                imageData.data[4 * (y * this.width + x) + 2] = outColor.blue;
                imageData.data[4 * (y * this.width + x) + 3] = outColor.alpha;
            }

            if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                return;
            }

            // We draw the selection hull
            for (let i = y - 1; i <= y + 1; i++) {
                for (let j = x - 1; j <= x + 1; j++) {
                    if (selection.data[i * this.width + j] !== 0) {
                        let greyColor = Math.floor(((x + y + this.selectionBorderColorShift) % 10) / 5) * 255;
                        imageData.data[4 * (y * this.width + x)] = greyColor;
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
}