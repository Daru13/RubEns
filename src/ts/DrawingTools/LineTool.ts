import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";
import { Rectangle } from "../DrawingPrimitives/Rectangle"
import { Ellipse } from "../DrawingPrimitives/Ellipse"
import { SimpleShapeTool } from "./SimpleShapeTool";
import { ImageWorkspace } from "../ImageWorkspace";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";


/**
 * Set of parameters used by [[LineTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class LineParameters implements ToolParameters {
    color: Params.ColorParameter = {
        kind: Params.ParameterKind.Color,
        value: "#000000",
        name: "Color"
    };

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
     * @return {ToDraw}               a function to apply on canvas
     *
     * @author Josselin GIET
     */
    static getLambda (param: LineParameters) {
        let brush = function(center: Point, image: ImageData) {
            Ellipse.drawFromCenter(image, center, param.thickness.value, param.thickness.value)
        };

        return brush;
    }

    /**
     * Draw a line in the given canvas.
     * @param image         The image where the shape is drawn
     * @param firstPoint    The first point selected by the user
     * @param secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
     drawShape(image: Canvas, firstPoint: Point, secondPoint: Point) {
        let imageData = image.getImageData();

        Line.draw(imageData, firstPoint, secondPoint, LineTool.getLambda(this.parameters));

        image.setImageData(imageData);
    }
}
