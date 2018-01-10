define(["require", "exports", "../utils/Point", "../utils/Color"], function (require, exports, Point_1, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Drawing primitives for lines
     */
    class Line {
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
        static draw(image, from, to, thickness, color) {
            // We don't draw a line if it is only a point
            if (from.x === to.x && from.y === to.y) {
                return;
            }
            // The corners of the bounding rectangle
            let minX = Math.min(from.x, to.x);
            let maxX = Math.max(from.x, to.x);
            let minY = Math.min(from.y, to.y);
            let maxY = Math.max(from.y, to.y);
            // The corners of the intersection between the bounding rectangle and the drawing
            let drawingMinX = Math.ceil(Math.max(0, Math.min(image.width - 1, minX - thickness)));
            let drawingMaxX = Math.floor(Math.max(0, Math.min(image.width - 1, maxX + thickness)));
            let drawingMinY = Math.ceil(Math.max(0, Math.min(image.height - 1, minY - thickness)));
            let drawingMaxY = Math.floor(Math.max(0, Math.min(image.height - 1, maxY + thickness)));
            // We compute the value of every pixel in the intersection of the bounding rect and the image
            for (let x = drawingMinX; x <= drawingMaxX; x++) {
                //x = alpha * from.x + (1-alpha) * to.x;
                let alpha;
                if (from.x === to.x) {
                    alpha = 0;
                }
                else {
                    alpha = (x - to.x) / (from.x - to.x);
                }
                // We compute the median of the y that will be drawn
                let middleY;
                if (alpha < 0) {
                    middleY = to.y;
                }
                else if (alpha > 1) {
                    middleY = from.y;
                }
                else {
                    middleY = Math.round(alpha * (from.y - to.y) + to.y);
                }
                // Then, we draw the pixels below middleY, and above middleY, and we stop when
                // we are outside of the segment
                let continueDrawing = true;
                for (let y = middleY; y <= drawingMaxY && continueDrawing; y++) {
                    continueDrawing = Line.drawPixel(x, y, from, to, thickness, color, image);
                }
                continueDrawing = true;
                for (let y = middleY - 1; y >= drawingMinY && continueDrawing; y--) {
                    continueDrawing = Line.drawPixel(x, y, from, to, thickness, color, image);
                }
            }
        }
        /**
         * Draw a single pixel of the segment.
         * Returns true if the given pixel contains a part of the segment.
         *
         * @param {number} x            The x axis of the pixel.
         * @param {number} y            The y axis of the pixel.
         * @param {Point} from          One segment bound.
         * @param {Point} to            The other segment bound.
         * @param {number} thickness    The thickness of the segment.
         * @param {Color} color         The color of the segment.
         * @param {ImageData} image     The image where the segment is being drawn.
         *
         * @returns {boolean} true if the pixel contained a part of the segment.
         */
        static drawPixel(x, y, from, to, thickness, color, image) {
            let offset = (y * image.width + x) * 4;
            let segmentColor = Line.getPixelColor(x, y, from, to, thickness, color);
            if (segmentColor.alpha === 0) {
                return false;
            }
            let destRed = image.data[offset];
            let destGreen = image.data[offset + 1];
            let destBlue = image.data[offset + 2];
            let destAlpha = image.data[offset + 3];
            let destColor = new Color_1.Color(destRed, destGreen, destBlue, destAlpha);
            let newColor = Color_1.Color.blend(segmentColor, destColor);
            image.data[offset] = newColor.red;
            image.data[offset + 1] = newColor.green;
            image.data[offset + 2] = newColor.blue;
            image.data[offset + 3] = newColor.alpha;
            return true;
        }
        /**
         * Get the color of a segment defined by the points from and to, on a given pixel (x,y).
         *
         * @param {number} x            The x axis of the pixel.
         * @param {number} y            The y axis of the pixel.
         * @param {Point} from          One segment bound.
         * @param {Point} to            The other segment bound.
         * @param {number} thickness    The thickness of the segment.
         * @param {Color} color         The color of the segment.
         *
         * @returns {Color}             The color for that pixel of the line draw.
         *
         * @author Mathieu Fehr
         */
        static getPixelColor(x, y, from, to, thickness, color) {
            // Get the distance to the segment
            let distanceToLine = Math.sqrt(Line.distanceToSegmentSquared(from, to, new Point_1.Point(x, y)));
            // If we are near enough of the segment, we can draw the color with full alpha
            if (distanceToLine < thickness - Math.sqrt(2)) {
                return color;
            }
            // If we are near the border of the segment, we will use multi sampling on the pixel to compute its alpha
            if (distanceToLine < thickness + Math.sqrt(2)) {
                // We multi sample the pixel in 81 small pixels
                let nbPointsInLine = 0;
                for (let dx = -4; dx <= 4; dx++) {
                    for (let dy = -4; dy <= 4; dy++) {
                        let distanceToLineSquared = Line.distanceToSegmentSquared(from, to, new Point_1.Point(x + dx / 8, y + dy / 8));
                        if (distanceToLineSquared < Math.pow(thickness, 2)) {
                            nbPointsInLine += 1;
                        }
                    }
                }
                // We compute the value of the new alpha we will apply on that pixel
                let newAlpha = (nbPointsInLine / 81) * color.alpha;
                return new Color_1.Color(color.red, color.green, color.blue, newAlpha);
            }
            // If we are too far from the segment, we will not color it.
            return new Color_1.Color(0, 0, 0, 0);
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
        static distanceToSegmentSquared(from, to, point) {
            let lengthSquared = from.distanceTo2(to);
            if (lengthSquared === 0) {
                return from.distanceTo2(point);
            }
            // We compute the nearest point in the segment with a projection
            let t = ((point.x - from.x) * (to.x - from.x) + (point.y - from.y) * (to.y - from.y)) / lengthSquared;
            t = Math.max(0, Math.min(1, t));
            let projectionPoint = new Point_1.Point(from.x + t * (to.x - from.x), from.y + t * (to.y - from.y));
            // And we return the distance between the point and its projection
            return point.distanceTo2(projectionPoint);
        }
    }
    exports.Line = Line;
});
