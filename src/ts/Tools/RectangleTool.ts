import { Point } from "../utils/Point";
import { Rectangle } from "../DrawingPrimitives/Rectangle";
import { SimpleShapeTool } from "./SimpleShapeTool";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";
import { Color } from "../utils/Color";

/**
 * Set of parameters used by [[RectangleTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class RectangleParameters implements ToolParameters {
    borderThickness: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Border thickness",
        min: 0,
        step: 1
    };
}


/**
 * Tool used to draw rectangles.
 *
 * The user select two points, and the rectangle drawn is the rectangle having the two points as corners.
 */
export class RectangleTool extends SimpleShapeTool {

    readonly name = "Rectangle";

    /**
     * Set of parameters of this tool.
     */
    parameters: RectangleParameters;

    /**
     * Basic constructor.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
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
    drawShape(firstPoint: Point, secondPoint: Point) {
        let imageData = new ImageData(this.workspace.width, this.workspace.height);

        let fillColor = Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
        let borderColor = Color.buildFromHex(this.documentParameters.sharedToolParameters.secondaryColor.value);
        let thickness = this.parameters.borderThickness.value;

        Rectangle.draw(firstPoint, secondPoint, imageData, fillColor, borderColor, thickness);

        this.workspace.workingCanvas.setImageData(imageData);
    }
}
