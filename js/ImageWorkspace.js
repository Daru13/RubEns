define(["require", "exports", "./Image/SelectedArea", "./utils/Color", "./Image/DisplayableCanvas", "./Image/LayerManager", "./Image/Canvas", "./Image/Layer"], function (require, exports, SelectedArea_1, Color_1, DisplayableCanvas_1, LayerManager_1, Canvas_1, Layer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Workspace of a [[Document]] instance, managing the various canvases used to display and edit an image.
     *
     * This includes the preview canvas used by drawing tools and the current selection.
     */
    class ImageWorkspace {
        /**
         * Instanciates and initializes a new ImageWorkspace object.
         * @param  {number}       width        Initial width of all canvases.
         * @param  {number}       height       Initial height of all canvases.
         * @param  {EventManager} eventManager Reference to the event manager.
         * @return {ImageWorkspace}            Fresh instance of ImageWorkspace.
         *
         * @author Mathieu Fehr, Camille Gobert
         */
        constructor(width, height, eventManager) {
            /**
             * The color of the drawingCanvas background.
             */
            this.drawingCanvasBgColor = new Color_1.Color(211, 211, 211, 255);
            /**
             * The event handler redrawing the layers when they are modified.
             */
            this.layersUpdateHandler = {
                eventTypes: ["rubens_deleteLayer",
                    "rubens_moveLayer",
                    "rubens_mergeLayers",
                    "rubens_changeLayerBlendMode",
                    "rubens_changeLayerVisibility"],
                callback: (_) => {
                    this.redrawDrawingLayers();
                }
            };
            this.width = width;
            this.height = height;
            this.currentZoomLevel = 1;
            this.createCanvases(eventManager);
            this.initSelection();
            eventManager.registerEventHandler(this.layersUpdateHandler);
            this.updateZoom();
            window.requestAnimationFrame(() => this.onRequestAnimationFrame());
        }
        /**
         * Initialize what is related to the selection (e.g. useful properties, selected area).
         *
         * @author Camille Gobert
         */
        initSelection() {
            this.selectionBorderColorShift = 0;
            this.selectionDrawingIntervalID = null;
            this.selectedArea = new SelectedArea_1.SelectedArea(this.width, this.height);
            this.selectedArea.selectEverything();
        }
        /**
         * Create canvases abstracting the three related HTML nodes.
         * @param {EventManager} eventManager   Reference to the event manager.
         *
         * @author Camille Gobert
         */
        createCanvases(eventManager) {
            let width = this.width;
            let height = this.height;
            this.drawingCanvas = new DisplayableCanvas_1.DisplayableCanvas(width, height, "drawing_canvas", eventManager);
            this.drawingLayers = new LayerManager_1.LayerManager(width, height, eventManager);
            this.drawingLayers.createLayer();
            this.workingCanvas = new Canvas_1.Canvas(width, height, eventManager);
            this.currentLayerPreview = new Layer_1.Layer(width, height, eventManager, "", -1);
            this.selectionCanvas = new DisplayableCanvas_1.DisplayableCanvas(width, height, "selection_canvas", eventManager);
        }
        /**
         * Redraw the layers on the drawing canvas.
         * This function has to be called when drawingLayers is modified.
         *
         * @author Mathieu Fehr
         */
        redrawDrawingLayers() {
            // First, we clear the drawing canvas
            this.drawingCanvas.clear();
            // Then, we draw the lower layers on the canvas
            this.drawingLayers.drawLowerLayersOn(this.drawingCanvas);
            // We display the selected layer only if necessary
            if (!this.drawingLayers.selectedLayer.hidden) {
                // We compute the preview of the selected layer
                // (by applying the tool preview on the data of the selected layer in a buffer layer)
                this.currentLayerPreview.canvas.clear();
                this.currentLayerPreview.blendMode = this.drawingLayers.selectedLayer.blendMode;
                this.currentLayerPreview.canvas.drawCanvas(this.drawingLayers.selectedLayer.canvas);
                this.currentLayerPreview.canvas.drawCanvas(this.workingCanvas);
                // We then draw the preview of the selected layer on the lower layers
                this.currentLayerPreview.drawOnCanvas(this.drawingCanvas);
            }
            // Finally, we draw the upper layers on the drawn layers
            this.drawingLayers.drawUpperLayersOn(this.drawingCanvas);
        }
        /**
         * Function to call when a frame is drawn.
         *
         * @author Mathieu Fehr
         */
        onRequestAnimationFrame() {
            this.redrawDrawingLayers();
            window.requestAnimationFrame(() => this.onRequestAnimationFrame());
        }
        /**
         * Apply the working canvas in the selected layer.
         * When a tool want to apply an operation in the drawingCanvas, it should draw it in the
         * working canvas, and then call this function.
         *
         * @author Mathieu Fehr
         */
        applyWorkingCanvas() {
            // We check that there is a selected layer
            if (this.drawingLayers.selectedLayer === null) {
                return;
            }
            let workingImageData = this.workingCanvas.getImageData();
            let drawingImageData = this.drawingLayers.selectedLayer.canvas.getImageData();
            // We select only the pixels that are in the selection
            this.selectedArea.data.forEach((value, index) => {
                if (value !== 0 && workingImageData.data[4 * index + 3] !== 0) {
                    let dest = new Color_1.Color(drawingImageData.data[4 * index], drawingImageData.data[4 * index + 1], drawingImageData.data[4 * index + 2], drawingImageData.data[4 * index + 3]);
                    let src = new Color_1.Color(workingImageData.data[4 * index], workingImageData.data[4 * index + 1], workingImageData.data[4 * index + 2], workingImageData.data[4 * index + 3]);
                    let out = Color_1.Color.blend(src, dest);
                    drawingImageData.data[4 * index] = Math.round(out.red);
                    drawingImageData.data[4 * index + 1] = Math.round(out.green);
                    drawingImageData.data[4 * index + 2] = Math.round(out.blue);
                    drawingImageData.data[4 * index + 3] = Math.round(out.alpha);
                }
            });
            this.drawingLayers.selectedLayer.canvas.setImageData(drawingImageData);
            this.redrawDrawingLayers();
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
         *
         * @author Mathieu Fehr
         */
        displaySelection() {
            this.selectionCanvas.clear();
            this.drawingLayers.drawOn(this.selectionCanvas);
            let imageData = this.selectionCanvas.getImageData();
            this.selectedArea.data.forEach((value, index) => {
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
                    let color = new Color_1.Color(red, green, blue, alpha);
                    let outColor = Color_1.Color.blend(color, this.drawingCanvasBgColor);
                    imageData.data[4 * (y * this.width + x)] = outColor.red;
                    imageData.data[4 * (y * this.width + x) + 1] = outColor.green;
                    imageData.data[4 * (y * this.width + x) + 2] = outColor.blue;
                    imageData.data[4 * (y * this.width + x) + 3] = outColor.alpha;
                }
            });
            this.selectionCanvas.setImageData(imageData);
            // We precompute the selection frontier
            this.selectedArea.computeSelectionFrontier();
            // We launch the selection update routine
            this.updateSelectionDisplay();
        }
        /**
         * Update the selection canvas regularly.
         * Set selectionDrawingIntervalID if it wasn't set before.
         * This function call itself 5 times per seconds, to update the selection.
         *
         * @author Mathieu Fehr
         */
        updateSelectionDisplay() {
            // If the routine wasn't started, we start it
            if (this.selectionDrawingIntervalID === null) {
                this.selectionDrawingIntervalID = window.setInterval(() => {
                    this.selectionBorderColorShift += 3;
                    this.selectionBorderColorShift %= 10;
                    this.updateSelectionDisplay();
                }, 200);
            }
            let imageData = this.selectionCanvas.getImageData();
            // We draw the frontier's pixel in the right color
            let length = this.selectedArea.selectionFrontier.length;
            for (let i = 0; i < length; i++) {
                let point = this.selectedArea.selectionFrontier[i];
                let x = point.x;
                let y = point.y;
                let greyColor = Math.floor(((x + y + this.selectionBorderColorShift) % 10) / 5) * 255;
                imageData.data[4 * (y * this.width + x)] = greyColor;
                imageData.data[4 * (y * this.width + x) + 1] = greyColor;
                imageData.data[4 * (y * this.width + x) + 2] = greyColor;
                imageData.data[4 * (y * this.width + x) + 3] = 255;
            }
            this.selectionCanvas.setImageData(imageData);
        }
        /**
         * Zoom in the image.
         */
        zoomIn() {
            this.currentZoomLevel *= 2;
            this.updateZoom();
        }
        /**
         * Zoom out of the image.
         */
        zoomOut() {
            this.currentZoomLevel /= 2;
            this.updateZoom();
        }
        /**
         * Update the canvas due to zoom change
         */
        updateZoom() {
            let drawingCanvas = $(this.drawingCanvas.canvas);
            drawingCanvas.css("height", this.currentZoomLevel * this.height + "px");
            drawingCanvas.css("width", this.currentZoomLevel * this.width + "px");
            let selectionCanvas = $(this.selectionCanvas.canvas);
            selectionCanvas.css("height", this.currentZoomLevel * this.height + "px");
            selectionCanvas.css("width", this.currentZoomLevel * this.width + "px");
            let canvasContainer = $("#canvas_container");
            canvasContainer.css("height", this.currentZoomLevel * this.height + 200 + "px");
            canvasContainer.css("width", this.currentZoomLevel * this.width + 200 + "px");
        }
        /**
         * Get the position of a mouse event relative to the image workspace.
         * @param  {MouseEvent} event The mouse event
         * @return                    The position of the mouse event relative to the image workspace.
         *
         * @author Mathieu Fehr
         */
        getMouseEventCoordinates(event) {
            return this.drawingCanvas.getMouseEventCoordinates(event);
        }
    }
    exports.ImageWorkspace = ImageWorkspace;
});
