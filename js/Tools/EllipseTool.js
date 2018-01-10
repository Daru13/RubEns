define(["require", "exports", "./SimpleShapeTool", "../DrawingPrimitives/Ellipse", "../Parameter", "../utils/Color"], function (require, exports, SimpleShapeTool_1, Ellipse_1, Params, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[EllipseTool]].
     * Default values of those parameters are defined in the class implementation.
     */
    class EllipseParameters {
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
    exports.EllipseParameters = EllipseParameters;
    /**
     * Tool used to draw ellipses.
     *
     * The user select two points, and the ellipse drawn is the inscribed ellipse of the
     * rectangle having the two points as corners.
     */
    class EllipseTool extends SimpleShapeTool_1.SimpleShapeTool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            this.name = "Ellipse";
            this.parameters = new EllipseParameters();
        }
        /**
         * Draw an ellipse in the given canvas.
         *
         * @param firstPoint    The first point selected by the user
         * @param secondPoint   The second point selected by the user
         *
         * @author Mathieu Fehr
         */
        drawShape(firstPoint, secondPoint) {
            let imageData = new ImageData(this.workspace.width, this.workspace.height);
            let color = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
            let borderThickness = this.parameters.borderThickness.value;
            let borderColor = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.secondaryColor.value);
            Ellipse_1.Ellipse.drawFromBoundingRect(firstPoint, secondPoint, color, borderThickness, borderColor, imageData);
            this.workspace.workingCanvas.setImageData(imageData);
        }
    }
    exports.EllipseTool = EllipseTool;
});
