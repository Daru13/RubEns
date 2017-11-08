import { Point } from "../utils/Point";
import { Color } from "../utils/Color";



/**
 * Drawing primitives for lines
 */
export class Line {


    /**
     * Draw an thick aliased segment defined by the points from and to.
     *
     * @param {ImageData} image     The image where the segment will be drawn.
     * @param {Point} from          A point defining the segment.
     * @param {Point} to            The other point defining the segment.
     * @param {number} thickness    The segment thickness.
     * @param {Color} color         The color of the segment.
     *
     * @author Mathieu Fehr
     */
    static draw(image: ImageData, from: Point, to: Point, thickness: number, color: Color) {

        // We don't draw a line if it is only a point
        if(from.x === to.x && from.y === to.y) {
            return;
        }

        // The corners of the bounding rectangle
        let minX = Math.min(from.x, to.x);
        let maxX = Math.max(from.x, to.x);
        let minY = Math.min(from.y, to.y);
        let maxY = Math.max(from.y, to.y);

        // The corners of the intersection between the bounding rectangle and the drawing
        let drawingMinX = Math.ceil(Math.max(0, Math.min(image.width-1, minX - thickness)));
        let drawingMaxX = Math.floor(Math.max(0, Math.min(image.width-1, maxX + thickness)));
        let drawingMinY = Math.ceil(Math.max(0, Math.min(image.height-1, minY - thickness)));
        let drawingMaxY = Math.floor(Math.max(0, Math.min(image.height-1, maxY + thickness)));

        // We compute the value of every pixel in the intersection of the bounding rect and the image
        for(let x = drawingMinX; x <= drawingMaxX; x++) {
            for(let y = drawingMinY; y <= drawingMaxY; y++) {

                // Get the color of this pixel, and draw it on the image
                let pixelColor = Line.getColorForPixel(x, y, from, to, thickness, color, image);

                let offset = (y * image.width + x) * 4;
                image.data[offset]     = pixelColor.red;
                image.data[offset + 1] = pixelColor.green;
                image.data[offset + 2] = pixelColor.blue;
                image.data[offset + 3] = pixelColor.alpha;
            }
        }
    }


    /**
     * Get the color of a pixel for a segment drawing
     *
     * @param {number} x            The x axis of the pixel.
     * @param {number} y            The y axis of the pixel.
     * @param {Point} from          One segment bound.
     * @param {Point} to            The other segment bound.
     * @param {number} thickness    The thickness of the segment.
     * @param {Color} color         The color of the segment.
     * @param {ImageData} image     The image where the segment will be drawn.
     *
     * @returns {Color}             The color for that pixel of the line draw.
     *
     * @author Mathieu Fehr
     */
    private static getColorForPixel(x: number, y: number, from: Point, to: Point, thickness: number, color: Color, image: ImageData): Color {

        // Get the distance to the segment
        let distanceToLine = Math.sqrt(Line.distanceToSegmentSquared(from, to, new Point(x,y)));

        // Get the color of the current pixel in the image
        // We need to get that, because there might be another color already there in the image
        // For instance, this is useful in the freehand drawing tool.
        let offset = (y * image.width + x) * 4;
        let destRed = image.data[offset];
        let destGreen = image.data[offset + 1];
        let destBlue = image.data[offset + 2];
        let destAlpha = image.data[offset + 3];
        let destColor = new Color(destRed, destGreen, destBlue, destAlpha);

        // If we are near enough of the segment, we can draw the color with full alpha
        if(distanceToLine < thickness - Math.sqrt(2)) {
            return Color.blend(color, destColor);
        }

        // If we are near the border of the segment, we will use multi sampling on the pixel to compute its alpha
        if(distanceToLine < thickness + Math.sqrt(2)) {

            // We multi sample the pixel in 81 small pixels
            let nbPointsInLine = 0;
            for(let dx = -4; dx <= 4; dx++) {
                for(let dy = -4; dy <= 4; dy++) {
                    let distanceToLineSquared = Line.distanceToSegmentSquared(from, to, new Point(x + dx/8, y + dy/8));
                    if(distanceToLineSquared < thickness ** 2) {
                        nbPointsInLine += 1;
                    }
                }
            }

            // We compute the value of the new alpha we will apply on that pixel
            let newAlpha = (nbPointsInLine / 81) * color.alpha;
            return Color.blend(new Color(color.red, color.blue, color.green, newAlpha), destColor);
        }

        // If we are too far from the segment, we will not color it.
        return destColor;
    }


    /**
     * Get the distance to the segment defined by from and to
     *
     * @param {Point} from      One bound of the segment.
     * @param {Point} to        The other bound of the segment.
     * @param {Point} point     The point for which we want the distance.
     * @returns {number}        The distance to the segment
     *
     * @author Mathieu Fehr
     */
    private static distanceToSegmentSquared(from: Point, to: Point, point: Point): number {
        let lengthSquared = from.distanceTo2(to);
        if(lengthSquared === 0) {
            return from.distanceTo2(point);
        }

        // We compute the nearest point in the segment with a projection
        let t = ((point.x - from.x) * (to.x - from.x) + (point.y - from.y) * (to.y - from.y)) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        let projectionPoint: Point = new Point(from.x + t * (to.x - from.x),
                                               from.y + t * (to.y - from.y));

        // And we return the distance between the point and its projection
        return point.distanceTo2(projectionPoint);
    }
}
