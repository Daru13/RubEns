import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { Rectangle } from "../DrawingPrimitives/Rectangle";
import { SimpleShapeTool } from "./SimpleShapeTool";

/**
 * Tool used to draw rectangles.
 *
 * The user select two points, and the rectangle drawn is the rectangle having the two points as corners.
 */
export class RectangleTool extends SimpleShapeTool {

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
     * Draw a rectangle in the given canvas.
     *
     * @param image         The image where the shape is drawn
     * @param firstPoint    The first point selected by the user
     * @param secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
    drawShape(image: Canvas, firstPoint: Point, secondPoint: Point) {
        let imageData = image.getImageData();

        Rectangle.draw(firstPoint, secondPoint, imageData);

        image.setImageData(imageData);
    }
}