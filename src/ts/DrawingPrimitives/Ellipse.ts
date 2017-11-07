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
        let drawing_min_x = Math.ceil(Math.max(0, center.x - Math.max(aBorder, aEllipse)));
        let drawing_min_y = Math.ceil(Math.max(0, center.y - Math.max(bBorder, bEllipse)));
        let drawing_max_x = Math.floor(Math.min(imageWidth - 1, center.x + Math.max(aBorder, aEllipse)));
        let drawing_max_y = Math.floor(Math.min(imageHeight - 1, center.y + Math.max(bBorder, bEllipse)));

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for (let i = drawing_min_x; i <= drawing_max_x; i++) {
            for (let j = drawing_min_y; j <= drawing_max_y; j++) {
                let x = i - center.x;
                let y = j - center.y;

                // when aEllipse or bEllipse is equal to 0, the code won't enter the if, which is what we want
                if((x / aEllipse) ** 2 + (y / bEllipse) ** 2 < 1) {
                    image.data[4 * (i + j * imageWidth)]     = color.red;
                    image.data[4 * (i + j * imageWidth) + 1] = color.green;
                    image.data[4 * (i + j * imageWidth) + 2] = color.blue;
                    image.data[4 * (i + j * imageWidth) + 3] = color.alpha;

                } else if((x / aEllipse) ** 2 + (y / bEllipse) ** 2 < (1 + Math.sqrt( aEllipse ** (-2) + bEllipse ** (-2)))**2) {
                    let nbCaseFilled = 0;
                    for(let dx = -4; dx <= 4; dx++) {
                        for(let dy = -4; dy <= 4; dy++) {
                            if(((x + (dx/8)) / aEllipse) ** 2 + ((y + (dy/8)) / bEllipse) ** 2 < 1) {
                                nbCaseFilled++;
                            }
                        }
                    }
                    let alpha = nbCaseFilled / 41;
                    if(nbCaseFilled > 41) {
                        console.log(nbCaseFilled);
                    }
                    if((x / aBorder) ** 2 + (y / bBorder) ** 2 <  1) {
                        let colorTemp = new Color(color.red, color.blue, color.green, color.alpha * alpha);
                        let outColor = Color.blend(colorTemp, borderColor);
                        image.data[4 * (i + j * imageWidth)] = Math.round(outColor.red);
                        image.data[4 * (i + j * imageWidth) + 1] = Math.round(outColor.green);
                        image.data[4 * (i + j * imageWidth) + 2] = Math.round(outColor.blue);
                        image.data[4 * (i + j * imageWidth) + 3] = Math.round(outColor.alpha)
                    } else {
                        image.data[4 * (i + j * imageWidth)] = color.red;
                        image.data[4 * (i + j * imageWidth) + 1] = color.green;
                        image.data[4 * (i + j * imageWidth) + 2] = color.blue;
                        image.data[4 * (i + j * imageWidth) + 3] = Math.round(color.alpha * alpha)
                    }

                } else if((x / aBorder) ** 2 + (y / bBorder) ** 2 <  1) {
                    image.data[4 * (i + j * imageWidth)]     = borderColor.red;
                    image.data[4 * (i + j * imageWidth) + 1] = borderColor.green;
                    image.data[4 * (i + j * imageWidth) + 2] = borderColor.blue;
                    image.data[4 * (i + j * imageWidth) + 3] = borderColor.alpha;

                } else if((x / aBorder) ** 2 + (y / bBorder) ** 2 < (1 + Math.sqrt(aBorder ** (-2) + bBorder ** (-2)))**2) {
                    let nbCaseFilled = 0;
                    for(let dx = -4; dx <= 4; dx++) {
                        for(let dy = -4; dy <= 4; dy++) {
                            if(((x + (dx/8)) / aBorder) ** 2 + ((y + (dy/8)) / bBorder) ** 2 < 1) {
                                nbCaseFilled++;
                            }
                        }
                    }
                    let alpha = nbCaseFilled / 41;
                    if(nbCaseFilled > 41) {
                        console.log(nbCaseFilled);
                    }
                    image.data[4 * (i + j * imageWidth)] = borderColor.red;
                    image.data[4 * (i + j * imageWidth) + 1] = borderColor.green;
                    image.data[4 * (i + j * imageWidth) + 2] = borderColor.blue;
                    image.data[4 * (i + j * imageWidth) + 3] = Math.round(borderColor.alpha * alpha)
                }
            }
        }
    }

}
