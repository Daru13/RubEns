import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";
import { Ellipse } from "../DrawingPrimitives/Ellipse"
import { SimpleShapeTool } from "./SimpleShapeTool";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";
import { Color } from "../utils/Color";


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
     * Returns a function to apply on canvas
     * @param  {LineParameters} param thickness and color
     *
     * @author Josselin GIET
     */
    static getLambda (param: LineParameters) {
        return function(center: Point, image: ImageData) {
            let color = Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
            Ellipse.drawFromCenter(image, center, param.thickness.value, param.thickness.value, color);
        };
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

        Line.draw(imageData, firstPoint, secondPoint, LineTool.getLambda(this.parameters));

        this.workspace.workingCanvas.setImageData(imageData);
    }
}
