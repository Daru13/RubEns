import { Point } from "../utils/Point";
import { Color } from "../utils/Color";


/**
 * Drawing primitive for rectangles
 */
export class Rectangle {

    /**
     * Draw a rectangle on the image, given two opposite corner of the rectangle
     *
     * @param {Point}     firstPoint        The first corner of the rectangle.
     * @param {Point}     secondPoint       The second corner of the rectangle.
     * @param {ImageData} image             The image where the rectangle will be drawn.
     * @param {Color}     fillColor         The inner color of the rectangle.
     * @param {Color}     borderColor       The border color of the rectangle.
     * @param {number}    borderThickness   The thickness of the border.
     *
     * @author Mathieu Fehr
     */
    static draw(firstPoint: Point, secondPoint: Point, image: ImageData, fillColor: Color, borderColor: Color, borderThickness: number) {
        // The current image
        let imageDataWidth = image.width;
        let imageDataHeight = image.height;
        borderThickness = Math.round(borderThickness);

        // Get the rectangle corners
        let minX = Math.round(Math.min(firstPoint.x, secondPoint.x));
        let minY = Math.round(Math.min(firstPoint.y, secondPoint.y));
        let maxX = Math.round(Math.max(firstPoint.x, secondPoint.x));
        let maxY = Math.round(Math.max(firstPoint.y, secondPoint.y));

        // The rectangle borders will be contained in this box
        let drawingBorderMinX = Math.max(0,minX - borderThickness);
        let drawingBorderMinY = Math.max(0,minY - borderThickness);
        let drawingBorderMaxX = Math.min(imageDataWidth-1, maxX + borderThickness);
        let drawingBorderMaxY = Math.min(imageDataHeight-1,maxY + borderThickness);


        // The rectangle will be contained in this box
        let drawingFillMinX = Math.max(0,minX + borderThickness);
        let drawingFillMinY = Math.max(0,minY + borderThickness);
        let drawingFillMaxX = Math.min(imageDataWidth-1, maxX - borderThickness);
        let drawingFillMaxY = Math.min(imageDataHeight-1,maxY - borderThickness);


        // Draw the borders
        // TODO draw less to be more efficient
        for(let i = drawingBorderMinX; i <= drawingBorderMaxX; i++) {
            for(let j = drawingBorderMinY; j <= drawingBorderMaxY; j++) {
                image.data[4 * (i + j * imageDataWidth)]     = borderColor.red;
                image.data[4 * (i + j * imageDataWidth) + 1] = borderColor.green;
                image.data[4 * (i + j * imageDataWidth) + 2] = borderColor.blue;
                image.data[4 * (i + j * imageDataWidth) + 3] = borderColor.alpha;
            }
        }

        // Draw the inner rectangle
        for(let i = drawingFillMinX; i <= drawingFillMaxX; i++) {
            for(let j = drawingFillMinY; j <= drawingFillMaxY; j++) {
                image.data[4 * (i + j * imageDataWidth)]     = fillColor.red;
                image.data[4 * (i + j * imageDataWidth) + 1] = fillColor.green;
                image.data[4 * (i + j * imageDataWidth) + 2] = fillColor.blue;
                image.data[4 * (i + j * imageDataWidth) + 3] = fillColor.alpha;
            }
        }
    }
}
