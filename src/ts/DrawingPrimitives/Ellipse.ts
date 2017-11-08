import { Point } from "../utils/Point";
import { Canvas } from "../Image/Canvas";
import { Color } from "../utils/Color";


/**
 * Drawing primitives for ellipses.
 * The ellipse is drawn with anti aliasing using multi sampling on border pixels.
 *
 * The border of the ellipse is a second ellipse below.
 * This is subject to change since it is not aesthetic for flat ellipses.
 */
export class Ellipse {

    /**
     * Draw an ellipse given two points defining the bounding rectangle.
     *
     * @param {ImageData} image         The image where the ellipse will be drawn.
     * @param {Point} firstPoint        The first point defining the bounding rectangle.
     * @param {Point} secondPoint       The second point defining the bounding rectangle.
     * @param {Color} color             The inner color of the ellipse.
     * @param {number} borderThickness  The thickness of the border.
     * @param {Color} borderColor       The color of the border.
     *
     * @author Mathieu Fehr
     */
    static drawFromBoundingRect(image: ImageData, firstPoint: Point, secondPoint: Point, color: Color,
                                                  borderThickness: number, borderColor: Color) {

        // Get the circumscribed rectangle upper-left and bottom-right corners
        let minX = Math.min(firstPoint.x, secondPoint.x);
        let minY = Math.min(firstPoint.y, secondPoint.y);
        let maxX = Math.max(firstPoint.x, secondPoint.x);
        let maxY = Math.max(firstPoint.y, secondPoint.y);

        // Compute the bounding rect center, height and width
        let center = new Point((minX + maxX)/2, (minY + maxY)/2);
        let width = Math.max(0, maxX - minX - borderThickness);
        let height = Math.max(0, maxY - minY - borderThickness);
        let borderWidth = maxX - minX + borderThickness;
        let borderHeight = maxY - minY + borderThickness;

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
        let aBorder = (borderWidth + 1)/2;
        let bBorder = (borderHeight + 1)/2;

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
        let drawingMinX = Math.ceil(Math.max(0, center.x - Math.max(aBorder, aEllipse)));
        let drawingMinY = Math.ceil(Math.max(0, center.y - Math.max(bBorder, bEllipse)));
        let drawingMaxX = Math.floor(Math.min(imageWidth - 1, center.x + Math.max(aBorder, aEllipse)));
        let drawingMaxY = Math.floor(Math.min(imageHeight - 1, center.y + Math.max(bBorder, bEllipse)));

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for (let j = drawingMinX; j <= drawingMaxX; j++) {
            for (let i = drawingMinY; i <= drawingMaxY; i++) {
                let x = j - center.x;
                let y = i - center.y;

                let pixelColor = Ellipse.getPixelColor(x, y, aEllipse, bEllipse, color, aBorder, bBorder, borderColor );
                let offset = 4 * (i * image.width + j);

                image.data[offset]     = pixelColor.red;
                image.data[offset + 1] = pixelColor.green;
                image.data[offset + 2] = pixelColor.blue;
                image.data[offset + 3] = pixelColor.alpha;
            }
        }
    }


    /**
     * Get the pixel color when drawing an ellipse
     *
     * @param {number} x            The x axis of the pixel (the center of the ellipse is 0).
     * @param {number} y            The y axis of the pixel (the center of the ellipse is 0).
     * @param {number} aEllipse     The a parameter of the fill ellipse.
     * @param {number} bEllipse     The b parameter of the fill ellipse.
     * @param {Color} fillColor     The fill ellipse color.
     * @param {number} aBorder      The a parameter of the border.
     * @param {number} bBorder      The b parameter of the border.
     * @param {Color} borderColor   The color of the border ellipse.
     *
     * @returns {Color}             The color of the pixel when drawing an ellipse
     *
     * @author Mathieu Fehr
     */
    private static getPixelColor(x: number, y: number, aEllipse: number, bEllipse: number, fillColor: Color,
                                 aBorder: number, bBorder: number, borderColor: Color): Color {

        // If the whole pixel is in the ellipse, the color is the fill color
        if(Ellipse.isPixelInEllipse(x, y, aEllipse, bEllipse)) {
            return fillColor;

        // If the pixel is between the fill ellipse and the border ellipse,
        // We use multi sampling to define the color
        } else if(Ellipse.mayPixelCollidingEllipse(x, y, aEllipse, bEllipse)) {
            let nbCaseFilled = 0;
            for(let dx = -4; dx <= 4; dx++) {
                for(let dy = -4; dy <= 4; dy++) {
                    if(Ellipse.isPointInEllipse(x + dx/8, y + dy/8, aEllipse, bEllipse)) {
                        nbCaseFilled++;
                    }
                }
            }
            let alphaFactor = nbCaseFilled / 81;

            // We check either we should blend with border color if it exist.
            if(Ellipse.isPointInEllipse(x, y, aBorder, bBorder)) {
                let colorTemp = new Color(fillColor.red, fillColor.blue, fillColor.green, fillColor.alpha * alphaFactor);
                return Color.blend(colorTemp, borderColor);
            } else {
                return new Color(fillColor.red, fillColor.green, fillColor.blue, Math.round(fillColor.alpha * alphaFactor));
            }

        // If we are fully in the border ellipse, the color is the border color
        } else if(Ellipse.isPixelInEllipse(x, y, aBorder, bBorder)) {
            return borderColor;

        // If the pixel is near the border of the border ellipse,
        // we use multi sampling to define the color
        } else if(Ellipse.mayPixelCollidingEllipse(x, y, aBorder, bBorder)) {
            let nbCaseFilled = 0;
            for(let dx = -4; dx <= 4; dx++) {
                for(let dy = -4; dy <= 4; dy++) {
                    if(((x + (dx/8)) / aBorder) ** 2 + ((y + (dy/8)) / bBorder) ** 2 < 1) {
                        nbCaseFilled++;
                    }
                }
            }
            let alphaFactor = nbCaseFilled / 81;
            return new Color(borderColor.red, borderColor.green, borderColor.blue, Math.round(borderColor.alpha * alphaFactor));
        }

        // Otherwise, we return an invisible color
        return new Color(0,0,0,0);
    }


    /**
     * Check if the pixel is fully in an ellipse.
     *
     * @param {number} x    The x axis of the center of the pixel.
     * @param {number} y    The y axis of the center of the pixel.
     * @param {number} a    The a parameter of the ellipse.
     * @param {number} b    The b parameter of the ellipse.
     *
     * @returns {boolean}   True if the pixel is contained in the ellipse.
     *
     * @author Mathieu Fehr
     */
    private static isPixelInEllipse(x: number, y: number, a: number, b: number): boolean {
        return (x / a) ** 2 + (y / b) ** 2
             < (1 - Math.sqrt(a ** (-2) + b ** (-2)))**2;
    }


    /**
     * Check if the point is in an ellipse
     *
     * @param {number} x    The x axis of the pixel.
     * @param {number} y    The y axis of the pixel.
     * @param {number} a    The a parameter of the ellipse.
     * @param {number} b    The b parameter of the ellipse.
     *
     * @returns {boolean}   True if the point is contained in the ellipse.
     *
     * @author Mathieu Fehr
     */
    private static isPointInEllipse(x: number, y: number, a:number, b: number): boolean {
        return (x / a) ** 2 + (y / b) ** 2 < 1;
    }


    /**
     * Check if the pixel may be colliding with an ellipse.
     *
     * @param {number} x    The x axis of the pixel.
     * @param {number} y    The y axis of the pixel.
     * @param {number} a    The a parameter of the ellipse.
     * @param {number} b    The b parameter of the ellipse.
     *
     * @returns {boolean}   True if the pixel might collide with the ellipse.
     *
     * @author Mathieu Fehr
     */
    private static mayPixelCollidingEllipse(x: number, y: number, a:number, b: number): boolean {
        return (x / a) ** 2 + (y / b) ** 2 <
            (1 + Math.sqrt(a ** (-2) + b ** (-2)))**2;
    }
}
