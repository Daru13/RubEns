import { Point } from "../utils/Point";
import { SimpleShapeTool } from "./SimpleShapeTool";
import { Ellipse } from "../DrawingPrimitives/Ellipse";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";


/**
 * Set of parameters used by [[RectangleTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class EllipseParameters implements ToolParameters {
    color: Params.ColorParameter = {
        kind: Params.ParameterKind.Color,
        value: "#000000",
        name: "Color"
    };

    borderThickness: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Border thickness",
        min: 1,
        step: 1
    };

    borderColor: Params.ColorParameter = {
        kind: Params.ParameterKind.Color,
        value: "#000000",
        name: "Border color",
    };
}


/**
 * Tool used to draw ellipses.
 *
 * The user select two points, and the ellipse drawn is the inscribed ellipse of the
 * rectangle having the two points as corners.
 */
export class EllipseTool extends SimpleShapeTool {

    readonly name = "Ellipse";

    /**
     * Set of parameters of this tool.
     */
    parameters: EllipseParameters;


    /**
     * Basic constructor.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
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
    drawShape(firstPoint: Point, secondPoint: Point) {
        let imageData = new ImageData(this.workspace.width, this.workspace.height);

        Ellipse.drawFromBoundingRect(imageData, firstPoint, secondPoint);

        this.workspace.workingCanvas.setImageData(imageData);
    }
}
