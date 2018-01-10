define(["require", "exports", "./Canvas"], function (require, exports, Canvas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * All the available blend modes for layers.
     */
    var BlendModes;
    (function (BlendModes) {
        BlendModes["Normal"] = "Normal";
        BlendModes["Add"] = "Add";
        BlendModes["Subtract"] = "Subtract";
        BlendModes["Multiply"] = "Multiply";
        BlendModes["Intensify"] = "Intensify";
        BlendModes["Screen"] = "Screen";
        BlendModes["Mask"] = "Mask";
        BlendModes["Color"] = "Color";
        BlendModes["Luminosity"] = "Luminosity";
    })(BlendModes = exports.BlendModes || (exports.BlendModes = {}));
    /**
     * Represent a layer in an document.
     * Internally, it is represented by a canvas, not visible by the user.
     */
    class Layer {
        /**
         * Create a new layer with given height and width.
         *
         * @param {number} height               The height of the layer.
         * @param {number} width                The width of the layer.
         * @param {EventManager} eventManager   The event handler.
         * @param {string} name                 The name of the layer.
         * @param {number} id                   The id of the layer.
         *
         * @author Mathieu Fehr
         */
        constructor(width, height, eventManager, name, id) {
            this.canvas = new Canvas_1.Canvas(width, height, eventManager);
            this.name = name;
            this.id = id;
            this.blendMode = BlendModes.Normal;
            this.hidden = false;
        }
        /**
         * Draw the layer on a canvas of the same size if the
         *
         * @param {Canvas} canvas   The canvas used to draw the layer.
         *
         * @author Mathieu Fehr
         */
        drawOnCanvas(canvas) {
            // We first check if we need to draw the layer
            if (this.hidden) {
                return;
            }
            // In this function, we will check the blend mode
            switch (this.blendMode) {
                case BlendModes.Add:
                    canvas.canvas2DContext.globalCompositeOperation = "lighter";
                    break;
                case BlendModes.Subtract:
                    canvas.canvas2DContext.globalCompositeOperation = "difference";
                    break;
                case BlendModes.Multiply:
                    canvas.canvas2DContext.globalCompositeOperation = "multiply";
                    break;
                case BlendModes.Intensify:
                    canvas.canvas2DContext.globalCompositeOperation = "overlay";
                    break;
                case BlendModes.Screen:
                    canvas.canvas2DContext.globalCompositeOperation = "screen";
                    break;
                case BlendModes.Mask:
                    canvas.canvas2DContext.globalCompositeOperation = "source-in";
                    break;
                case BlendModes.Color:
                    canvas.canvas2DContext.globalCompositeOperation = "color";
                    break;
                case BlendModes.Luminosity:
                    canvas.canvas2DContext.globalCompositeOperation = "luminosity";
                    break;
                default:
                    break;
            }
            canvas.drawCanvas(this.canvas);
            canvas.canvas2DContext.globalCompositeOperation = "source-over";
        }
    }
    exports.Layer = Layer;
});
