define(["require", "exports", "../DrawingPrimitives/Rectangle", "./SimpleShapeTool", "../Parameter", "../utils/Color"], function (require, exports, Rectangle_1, SimpleShapeTool_1, Params, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[RectangleTool]].
     * Default values of those parameters are defined in the class implementation.
     */
    class RectangleParameters {
        constructor() {
            this.borderThickness = {
                kind: Params.ParameterKind.Number,
                value: 1,
                name: "Border thickness",
                min: 0,
                step: 1
            };
        }
    }
    exports.RectangleParameters = RectangleParameters;
    /**
     * Tool used to draw rectangles.
     *
     * The user select two points, and the rectangle drawn is the rectangle having the two points as corners.
     */
    class RectangleTool extends SimpleShapeTool_1.SimpleShapeTool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            this.name = "Rectangle";
            this.parameters = new RectangleParameters();
        }
        /**
         * Draw a rectangle in the given canvas.
         *
         * @param firstPoint    The first point selected by the user
         * @param secondPoint   The second point selected by the user
         *
         * @author Mathieu Fehr
         */
        drawShape(firstPoint, secondPoint) {
            let imageData = new ImageData(this.workspace.width, this.workspace.height);
            let fillColor = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
            let borderColor = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.secondaryColor.value);
            let thickness = this.parameters.borderThickness.value;
            Rectangle_1.Rectangle.drawWithBorders(firstPoint, secondPoint, fillColor, borderColor, thickness, imageData);
            this.workspace.workingCanvas.setImageData(imageData);
        }
    }
    exports.RectangleTool = RectangleTool;
});
