import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { SimpleShapeTool } from "./SimpleShapeTool";
import { Ellipse } from "../DrawingPrimitives/Ellipse";

/**
 * Tool used to draw ellipses.
 *
 * The user select two points, and the ellipse drawn is the inscribed ellipse of the
 * rectangle having the two points as corners.
 */
export class EllipseTool extends SimpleShapeTool {

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
     * Draw an ellipse in the given canvas.
     *
     * @param image         The image where the shape is drawn
     * @param firstPoint    The first point selected by the user
     * @param secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
    drawShape(image: Canvas, firstPoint: Point, secondPoint: Point) {
        let imageData = image.getImageData();

        Ellipse.drawFromBoundingRect(imageData, firstPoint, secondPoint);

        image.setImageData(imageData);
    }
}