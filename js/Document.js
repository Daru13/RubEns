define(["require", "exports", "./Image/ImageFormat", "./ImageWorkspace", "./History"], function (require, exports, ImageFormat_1, ImageWorkspace_1, History_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Document representing an open image and all its metadata.
     *
     * It includes all the information related to an image, as well as methods used
     * to interract with it (such as importing, exporting and editing it).
     */
    class Document {
        /**
         * Instanciates and initializes a new Document object.
         * @param  {DocumentParameters} parameters   Document parameters to use.
         * @param  {EventManager}       eventManager Instance of the event manager.
         * @return {Document}                        Fresh instance of document.
         *
         * @author Camille Gobert
         */
        constructor(parameters, eventManager) {
            this.parameters = parameters;
            this.eventManager = eventManager;
            this.imageWorkspace = new ImageWorkspace_1.ImageWorkspace(this.parameters.width.value, this.parameters.height.value, eventManager);
            this.history = new History_1.History(this, this.eventManager);
        }
        /**
         * Export the current image in png format.
         *
         * @author Mathieu Fehr
         */
        exportImage() {
            this.imageWorkspace.drawingCanvas.exportImage(ImageFormat_1.ImageFormat.png, this.parameters.title.value);
        }
        /**
         * Ask the user for an image, and start to load it.
         * Once loaded, the [[onImageLoad]] callback method is called.
         *
         * @author Mathieu Fehr
         */
        importImage() {
            // The node is used to trigger the image loading
            let inputNode = document.createElement("input");
            inputNode.setAttribute("type", "file");
            // function to call when the image is loaded in the html node
            inputNode.addEventListener("change", () => this.onImageLoad(inputNode));
            inputNode.style.display = "none";
            document.body.appendChild(inputNode);
            inputNode.click();
        }
        /**
         * Callback function called whenever an image has been loaded.
         * @param {HTMLInputElement} inputNode The HTML input node containing the file.
         *
         * @author Mathieu Fehr
         */
        onImageLoad(inputNode) {
            let file = inputNode.files[0];
            let imageType = /image.*/;
            if (file && file.type.match(imageType)) {
                this.copyFileImageToCanvas(file, () => (document.body.removeChild(inputNode)));
            }
            else {
                // TODO remove alert and create proper error blocks
                alert("Error while loading image");
            }
        }
        /**
         * Copy a loaded and valid image file in a canvas.
         * @param {File}             file           Loaded file containing the image.
         * @param {HTMLInputElement} onCopyEnd      Callback function called when the copy has ended.
         *
         * @author Mathieu Fehr
         */
        copyFileImageToCanvas(file, onCopyEnd) {
            let self = this;
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                let img = new Image();
                img.addEventListener("load", function () {
                    // TODO change interface when image size is not the same
                    self.imageWorkspace.drawingLayers.createLayer("New Layer");
                    self.imageWorkspace.drawingLayers.selectedLayer.canvas.importImage(img);
                    self.imageWorkspace.redrawDrawingLayers();
                    onCopyEnd();
                });
                img.src = reader.result;
            });
            reader.readAsDataURL(file);
        }
        /**
         * Returns the current tool.
         * @return {Tool} The current tool.
         *
         * @author Camille Gobert
         */
        getCurrentTool() {
            return this.currentTool;
        }
        /**
         * Updates the current tool and the related event handlers.
         * @param {Tool} tool The new drawing tool.
         *
         * @author Camille Gobert
         */
        setCurrentTool(tool) {
            if (this.currentTool) {
                this.currentTool.unregisterEvents(this.eventManager);
            }
            tool.workspace = this.imageWorkspace;
            this.currentTool = tool;
            tool.registerEvents(this.eventManager);
        }
    }
    exports.Document = Document;
});