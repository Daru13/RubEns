import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";
import { SimpleShapeTool } from "./SimpleShapeTool";

/**
 * Tool used to draw lines.
 *
 * The user selects two points, defining the line the user will draw.
 */
export class LineTool extends SimpleShapeTool {

    /**
     * Basic constructor.
     *
     * @param workingCanvas The current working canvas
     * @param previewCanvas The current preview canvas
     *
     * @author Mathieu Fehr
     */
    constructor(workingCanvas: Canvas, previewCanvas: Canvas) {
        super(workingCanvas, previewCanvas);
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

        Line.draw(imageData, firstPoint, secondPoint, 1);

        image.setImageData(imageData);
    }
}