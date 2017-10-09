import { Point } from "../utils/Point";


/**
 * Drawing primitive for rectangles
 */
export class Rectangle {

    /**
     * Draw a rectangle on the image, given two opposite corner of the rectangle
     *
     * @param {Point} firstPoint    The first corner of the rectangle
     * @param {Point} secondPoint   The second corner of the rectangle
     * @param {ImageData} image     The image where the rectangle will be drawn
     */
    static draw(firstPoint: Point, secondPoint: Point, image: ImageData) {
        // The current image
        let imageDataWidth = image.width;
        let imageDataHeight = image.height;

        // Get the rectangle corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // The color is currently random
        // TODO use the color given in parameters
        let color_r = Math.random() * 255;
        let color_g = Math.random() * 255;
        let color_b = Math.random() * 255;

        // The ellipse will be contained
        let drawing_min_x = Math.max(0,min_x);
        let drawing_min_y = Math.max(0,min_y);
        let drawing_max_x = Math.min(imageDataWidth-1,max_x);
        let drawing_max_y = Math.min(imageDataHeight-1,max_y);

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for(let i = drawing_min_x; i <= drawing_max_x; i++) {
            for(let j = drawing_min_y; j <= drawing_max_y; j++) {
                image.data[4 * (i + j * imageDataWidth)] = color_r;
                image.data[4 * (i + j * imageDataWidth) + 1] = color_g;
                image.data[4 * (i + j * imageDataWidth) + 2] = color_b;
                image.data[4 * (i + j * imageDataWidth) + 3] = 255;
            }
        }
    }
}