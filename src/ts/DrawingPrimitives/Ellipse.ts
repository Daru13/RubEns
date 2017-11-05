import { Point } from "../utils/Point";
import { Canvas } from "../Image/Canvas";
import { Color } from "../utils/Color";


/**
 * Drawing primitives for ellipses
 */
export class Ellipse {

    /**
     * Draw an ellipse given two points defining the bounding rectangle
     *
     * @param image         The image where the ellipse will be drawn
     * @param firstPoint    The first point defining the bounding rectangle
     * @param secondPoint   The second point defining the bounding rectangle
     * @param {Color} color The inner color of the ellipse.
     *
     * @author Mathieu Fehr
     */
    // TODO add parameters
    static drawFromBoundingRect(image: ImageData, firstPoint: Point, secondPoint: Point, color: Color) {

        // Get the circumscribed rectangle upper-left and bottom-right corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // Compute the bounding rect center, height and width
        let center = new Point((min_x + max_x)/2, (min_y + max_y)/2);
        let width = max_x - min_x;
        let height = max_y - min_y;

        // Draw the ellipse using these parameters
        Ellipse.drawFromCenter(image, center, width, height, color);
    }


    /**
     * Draw an ellipse given the center, height and width of bounding rectangle
     *
     * @param {Point} center    The center of the bounding rectangle
     * @param {number} width    The width of the bounding rectangle
     * @param {number} height   The height of the bounding rectangle
     * @param {Canvas} image    The image where the ellipse will be drawn
     * @param {Color}  color    The inner color of the ellipse.
     *
     * @author Mathieu Fehr
     */
    static drawFromCenter(image: ImageData, center: Point, width: number, height: number, color: Color) {

        // Compute the equation parameters
        let a = width/2;
        let b = height/2;

        // And draw the ellipse with the equation
        Ellipse.drawFromEquation(image, center, a, b, color);
    }

    /**
     * Draw an ellipse given this equation of the ellipse :
     * ((x-center.x)/a)**2 + ((y - center.y)/b)**2 < 1
     *
     * @param {Point} center    The center of the ellipse
     * @param {number} a        The a parameter, representing width/2
     * @param {number} b        The b parameter, representing height/2
     * @param {Canvas} image    The image where the ellipse will be drawn
     * @param {Color}  color    The inner color of the ellipse.
     *
     * @author Mathieu Fehr
     */
    static drawFromEquation(image: ImageData, center: Point, a: number, b: number, color: Color) {

        center.x = Math.round(center.x);
        center.y = Math.round(center.y);
        a = Math.round(a);
        b = Math.round(b);

        // The current image
        let imageWidth = image.width;
        let imageHeight = image.height;

        // Get the four color components
        let color_red   = color.red;
        let color_green = color.green;
        let color_blue  = color.blue;
        let color_alpha = color.alpha;

        // The ellipse will be contained in this box in the image
        let drawing_min_x = Math.max(0, center.x - a);
        let drawing_min_y = Math.max(0, center.y - b);
        let drawing_max_x = Math.min(imageWidth - 1, center.x + a);
        let drawing_max_y = Math.min(imageHeight - 1, center.y + b);

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for (let i = drawing_min_x; i <= drawing_max_x; i++) {
            for (let j = drawing_min_y; j <= drawing_max_y; j++) {
                let x = (i - center.x);
                let y = (j - center.y);
                if ((x / a) ** 2 + (y / b) ** 2 < 1) {
                    image.data[4 * (i + j * imageWidth)]     = color_red;
                    image.data[4 * (i + j * imageWidth) + 1] = color_green;
                    image.data[4 * (i + j * imageWidth) + 2] = color_blue;
                    image.data[4 * (i + j * imageWidth) + 3] = color_alpha;
                }
            }
        }
    }

}
