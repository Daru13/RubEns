import { Point } from "../utils/Point";
import { Color } from "../utils/Color";


/**
 * Drawing primitive for rectangles
 */
export class Rectangle {

    /**
     * Draw a rectangle on the image, given two opposite corner of the rectangle
     *
     * @param {Point}     firstPoint    The first corner of the rectangle.
     * @param {Point}     secondPoint   The second corner of the rectangle.
     * @param {ImageData} image         The image where the rectangle will be drawn.
     * @param {Color}     color         The inner color of the rectangle.
     *
     * @author Mathieu Fehr
     */
    static draw(firstPoint: Point, secondPoint: Point, image: ImageData, color: Color) {
        // The current image
        let imageDataWidth = image.width;
        let imageDataHeight = image.height;

        // Get the rectangle corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // Get the four color components
        let color_red   = color.red;
        let color_green = color.green;
        let color_blue  = color.blue;
        let color_alpha = color.alpha;

        // The rectangle will be contained in this box
        let drawing_min_x = Math.max(0,min_x);
        let drawing_min_y = Math.max(0,min_y);
        let drawing_max_x = Math.min(imageDataWidth-1,max_x);
        let drawing_max_y = Math.min(imageDataHeight-1,max_y);


        // Draw the rectangle
        for(let i = drawing_min_x; i <= drawing_max_x; i++) {
            for(let j = drawing_min_y; j <= drawing_max_y; j++) {
                image.data[4 * (i + j * imageDataWidth)]     = color_red;
                image.data[4 * (i + j * imageDataWidth) + 1] = color_green;
                image.data[4 * (i + j * imageDataWidth) + 2] = color_blue;
                image.data[4 * (i + j * imageDataWidth) + 3] = color_alpha;
            }
        }
    }
}
