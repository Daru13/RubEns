import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";
import { Rectangle } from "../DrawingPrimitives/Rectangle"
import { Ellipse } from "../DrawingPrimitives/Ellipse"
import { SimpleShapeTool } from "./SimpleShapeTool";
import { ImageWorkspace } from "../ImageWorkspace";
import { LineParameters } from "./LineParameters"

/**
 * Tool used to draw lines.
 *
 * The user selects two points, defining the line the user will draw.
 */
export class LineTool extends SimpleShapeTool {

    /**
     * parameters of the current brush
     *
     * @author Josselin GIET
     */
    parameters: LineParameters = new LineParameters();

    /**
     * Basic constructor.
     *
     * @param workspace The image workspace, where the operations are displayed
     *
     * @author Mathieu Fehr
     */
    constructor(workspace: ImageWorkspace) {
        super(workspace);
    }

    initParameters(){
        this.parameters = new LineParameters;

    }


    /**
     * Returns a function to apply on canvas
     * @param  {LineParameters} param thickness and color
     * @return {ToDraw}               a function to apply on canvas
     *
     * @author Josselin GIET
     */
    static getLambda(param: LineParameters){
        let brush = function(center: Point, image: ImageData){
            Ellipse.drawFromCenter(image, center, param.thickness.value, param.thickness.value)
        }
        return brush
    }

    /**
     * Draw a line in the given canvas.
     *
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
