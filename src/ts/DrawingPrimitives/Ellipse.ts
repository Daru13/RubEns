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
     * @param {ImageData} image         The image where the ellipse will be drawn
     * @param {Point} firstPoint        The first point defining the bounding rectangle
     * @param {Point} secondPoint       The second point defining the bounding rectangle
     * @param {Color} color             The inner color of the ellipse.
     * @param {number} borderThickness  The thickness of the border
     * @param {Color} borderColor       The color of the border
     *
     * @author Mathieu Fehr
     */
    static drawFromBoundingRect(image: ImageData, firstPoint: Point, secondPoint: Point, color: Color,
                                                  borderThickness: number, borderColor: Color) {

        // Get the circumscribed rectangle upper-left and bottom-right corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // Compute the bounding rect center, height and width
        let center = new Point((min_x + max_x)/2, (min_y + max_y)/2);
        let width = Math.max(0, max_x - min_x - borderThickness);
        let height = Math.max(0, max_y - min_y - borderThickness);
        let borderWidth = max_x - min_x + borderThickness;
        let borderHeight = max_y - min_y + borderThickness;

        // Draw the ellipse using these parameters
        Ellipse.drawFromCenter(image, center, width, height, color, borderWidth, borderHeight, borderColor);
    }


    /**
     * Draw an ellipse given the center, height and width of the ellipse, and its border.
     * The height and the width of the ellipse is the height and the width of the bounding rect
     * of the ellipse, without the border.
     * The height and the width of the borders is the height and the width of the bounding rect
     * of the ellipse, with the border.
     *
     * @param {Point} center        The center of the bounding rectangle
     * @param {number} width        The width of the ellipse, with border excluded
     * @param {number} height       The height of the ellipse, with border excluded.
     * @param {Canvas} image        The image where the ellipse will be drawn
     * @param {Color}  color        The inner color of the ellipse.
     * @param {number} borderWidth  The width of the ellipse, with border included
     * @param {number} borderHeight The height of the ellipse, with border included
     * @param {Color} borderColor   The color of the border
     *
     * @author Mathieu Fehr
     */
    static drawFromCenter(image: ImageData, center: Point,
                          width: number, height: number, color: Color,
                          borderWidth: number, borderHeight: number, borderColor: Color) {

        // Compute the equation parameters
        let aEllipse = width/2;
        let bEllipse = height/2;
        let aBorder = borderWidth/2;
        let bBorder = borderHeight/2;

        // And draw the ellipse with the equation
        Ellipse.drawFromEquation(image, center, aEllipse, bEllipse, color, aBorder, bBorder, borderColor);
    }

    /**
     * Draw an ellipse given this equation of the ellipse :
     * ((x-center.x)/a)**2 + ((y - center.y)/b)**2 < 1
     *
     * @param {Point} center        The center of the ellipse
     * @param {number} aEllipse     The a parameter, representing width/2
     * @param {number} bEllipse     The b parameter, representing height/2
     * @param {Canvas} image        The image where the ellipse will be drawn
     * @param {Color}  color        The inner color of the ellipse.
     * @param {number} aBorder      The a parameter of the border ellipse.
     * @param {number} bBorder      The b parameter of the border ellipse.
     * @param {Color} borderColor   The color of the border.
     *
     * @author Mathieu Fehr
     */
    static drawFromEquation(image: ImageData, center: Point,
                            aEllipse: number, bEllipse: number, color: Color,
                            aBorder: number, bBorder: number, borderColor: Color) {

        // The current image
        let imageWidth = image.width;
        let imageHeight = image.height;

        // The ellipse will be contained in this box in the image
        let drawing_min_x = Math.ceil(Math.max(0, center.x - aBorder));
        let drawing_min_y = Math.ceil(Math.max(0, center.y - bBorder));
        let drawing_max_x = Math.floor(Math.min(imageWidth - 1, center.x + aBorder));
        let drawing_max_y = Math.floor(Math.min(imageHeight - 1, center.y + bBorder));

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for (let i = drawing_min_x; i <= drawing_max_x; i++) {
            for (let j = drawing_min_y; j <= drawing_max_y; j++) {
                let x = i - center.x;
                let y = j - center.y;

                // when aEllipse or bEllipse is equal to 0, the code won't enter the if, which is what we want
                if ((x / aEllipse) ** 2 + (y / bEllipse) ** 2 < 1) {
                    image.data[4 * (i + j * imageWidth)]     = color.red;
                    image.data[4 * (i + j * imageWidth) + 1] = color.green;
                    image.data[4 * (i + j * imageWidth) + 2] = color.blue;
                    image.data[4 * (i + j * imageWidth) + 3] = color.alpha;
                } else if((x / aBorder) ** 2 + (y / bBorder) ** 2 < 1) {
                    image.data[4 * (i + j * imageWidth)]     = borderColor.red;
                    image.data[4 * (i + j * imageWidth) + 1] = borderColor.green;
                    image.data[4 * (i + j * imageWidth) + 2] = borderColor.blue;
                    image.data[4 * (i + j * imageWidth) + 3] = borderColor.alpha;
                }
            }
        }
    }

}
