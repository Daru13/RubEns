define(["require", "exports", "../DrawingPrimitives/Line", "./SimpleShapeTool", "../Parameter", "../utils/Color"], function (require, exports, Line_1, SimpleShapeTool_1, Params, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[LineTool]].
     * Default values of those parameters are defined in the class implementation.
     */
    class LineParameters {
        constructor() {
            this.thickness = {
                kind: Params.ParameterKind.Number,
                value: 1,
                name: "Line thickness",
                min: 1,
                step: 1
            };
        }
    }
    exports.LineParameters = LineParameters;
    /**
     * Tool used to draw lines.
     *
     * Draw a line between the two points selected by the user.
     */
    class LineTool extends SimpleShapeTool_1.SimpleShapeTool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            this.name = "Line";
            this.parameters = new LineParameters();
        }
        /**
         * Draw a line in the given canvas.
         * @param firstPoint    The first point selected by the user
         * @param secondPoint   The second point selected by the user
         *
         * @author Mathieu Fehr
         */
        drawShape(firstPoint, secondPoint) {
            let imageData = new ImageData(this.workspace.width, this.workspace.height);
            let color = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
            let thickness = this.parameters.thickness.value / 2;
            Line_1.Line.draw(imageData, firstPoint, secondPoint, thickness, color);
            this.workspace.workingCanvas.setImageData(imageData);
        }
    }
    exports.LineTool = LineTool;
});
