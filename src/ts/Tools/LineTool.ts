import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";
import { SimpleShapeTool } from "./SimpleShapeTool";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";
import { Color } from "../utils/Color";
import { DocumentParameters } from "../DocumentParameters";


/**
 * Set of parameters used by [[LineTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class LineParameters implements ToolParameters {
    thickness: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Line thickness",
        min: 1,
        step: 1
    };
}

/**
 * Tool used to draw lines.
 *
 * Draw a line between the two points selected by the user.
 */
export class LineTool extends SimpleShapeTool {

    readonly name = "Line";

    /**
     * Set of parameters of this tool.
     */
    parameters: LineParameters;

    /**
     * Basic constructor.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
        this.parameters = new LineParameters();
    }

    /**
     * Draw a line in the given canvas.
     * @param firstPoint    The first point selected by the user
     * @param secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
     drawShape(firstPoint: Point, secondPoint: Point) {
        let imageData = new ImageData(this.workspace.width, this.workspace.height);

        let color = Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
        let thickness = this.parameters.thickness.value / 2;

        Line.draw(imageData, firstPoint, secondPoint, thickness, color);

        this.workspace.workingCanvas.setImageData(imageData);
    }
}
