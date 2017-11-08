import { Point } from "../utils/Point";
import { SimpleShapeTool } from "./SimpleShapeTool";
import { Ellipse } from "../DrawingPrimitives/Ellipse";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";
import { Color } from "../utils/Color";


/**
 * Set of parameters used by [[RectangleTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class EllipseParameters implements ToolParameters {
    borderThickness: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Border thickness",
        min: 0,
        step: 1
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

        let color = Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
        let borderThickness = this.parameters.borderThickness.value;
        let borderColor = Color.buildFromHex(this.documentParameters.sharedToolParameters.secondaryColor.value);

        Ellipse.drawFromBoundingRect(firstPoint, secondPoint, color, borderThickness, borderColor, imageData);

        this.workspace.workingCanvas.setImageData(imageData);
    }
}
