define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Drawing primitive for rectangles
     */
    class Rectangle {
        /**
         * Draw a rectangle on the image, given two opposite corner of the rectangle
         *
         * @param {Point}     firstPoint        The first corner of the rectangle.
         * @param {Point}     secondPoint       The second corner of the rectangle.
         * @param {Color}     fillColor         The inner color of the rectangle.
         * @param {Color}     borderColor       The border color of the rectangle.
         * @param {number}    borderThickness   The thickness of the border.
         * @param {ImageData} image             The image where the rectangle will be drawn.
         *
         * @author Mathieu Fehr
         */
        static drawWithBorders(firstPoint, secondPoint, fillColor, borderColor, borderThickness, image) {
            // The current image
            borderThickness = Math.round(borderThickness);
            // Get the rectangle corners
            let minX = Math.round(Math.min(firstPoint.x, secondPoint.x));
            let minY = Math.round(Math.min(firstPoint.y, secondPoint.y));
            let maxX = Math.round(Math.max(firstPoint.x, secondPoint.x));
            let maxY = Math.round(Math.max(firstPoint.y, secondPoint.y));
            Rectangle.drawVerticalBorder(minX, minY, maxY, borderThickness, borderColor, image);
            Rectangle.drawVerticalBorder(maxX, minY, maxY, borderThickness, borderColor, image);
            Rectangle.drawHorizontalBorder(minX, maxX, minY, borderThickness, borderColor, image);
            Rectangle.drawHorizontalBorder(minX, maxX, maxY, borderThickness, borderColor, image);
            Rectangle.drawInnerRectangle(minX, maxX, minY, maxY, borderThickness, fillColor, image);
        }
        /**
         * Draw a vertical border of the rectangle
         *
         * @param {number} centerX      The x center of the border.
         * @param {number} minY         The minimal y coordinate of the rectangle without its border.
         * @param {number} maxY         The maximal y coordinate of the rectangle without its border.
         * @param {number} thickness    The thickness of the border.
         * @param {Color} color         The color of the border.
         * @param {ImageData} image     The image where the border will be drawn.
         *
         * @author Mathieu Fehr
         */
        static drawVerticalBorder(centerX, minY, maxY, thickness, color, image) {
            let imageDataWidth = image.width;
            let imageDataHeight = image.height;
            // Draw the left border
            let drawingMinX = Math.min(imageDataWidth - 1, Math.max(0, centerX - thickness));
            let drawingMaxX = Math.min(imageDataWidth - 1, Math.max(0, centerX + thickness));
            let drawingMinY = Math.min(imageDataHeight - 1, Math.max(0, minY - thickness));
            let drawingMaxY = Math.min(imageDataHeight - 1, Math.max(0, maxY + thickness));
            Rectangle.drawRectangle(drawingMinX, drawingMaxX, drawingMinY, drawingMaxY, color, image);
        }
        /**
         * Draw a vertical border of the rectangle
         *
         * @param {number} minX         The minimal x coordinate of the rectangle without its border.
         * @param {number} maxX         The maximal x coordinate of the rectangle without its border.
         * @param {number} centerY      The y center of the border.
         * @param {number} thickness    The thickness of the border.
         * @param {Color} color         The color of the border.
         * @param {ImageData} image     The image where the border will be drawn.
         *
         * @author Mathieu Fehr
         */
        static drawHorizontalBorder(minX, maxX, centerY, thickness, color, image) {
            let imageDataWidth = image.width;
            let imageDataHeight = image.height;
            // Draw the left border
            let drawingMinX = Math.min(imageDataWidth - 1, Math.max(0, minX - thickness));
            let drawingMaxX = Math.min(imageDataWidth - 1, Math.max(0, maxX + thickness));
            let drawingMinY = Math.min(imageDataHeight - 1, Math.max(0, centerY - thickness));
            let drawingMaxY = Math.min(imageDataHeight - 1, Math.max(0, centerY + thickness));
            Rectangle.drawRectangle(drawingMinX, drawingMaxX, drawingMinY, drawingMaxY, color, image);
        }
        /**
         * Draw the inner rectangle (the rectangle without its borders).
         *
         * @param {number} minX     The minimal x coordinate of the rectangle without its border.
         * @param {number} maxX     The maximal x coordinate of the rectangle without its border.
         * @param {number} minY     The minimal y coordinate of the rectangle without its border.
         * @param {number} maxY     The maximal y coordinate of the rectangle without its border.
         * @param thickness         The thickness of the borders.
         * @param {Color} color     The color of the inner rectangle.
         * @param {ImageData} image The image where the border will be drawn.
         *
         * @author Mathieu Fehr
         */
        static drawInnerRectangle(minX, maxX, minY, maxY, thickness, color, image) {
            let imageDataWidth = image.width;
            let imageDataHeight = image.height;
            // The rectangle will be contained in this box
            let drawingMinX = Math.min(imageDataWidth - 1, Math.max(0, minX + thickness));
            let drawingMaxX = Math.min(imageDataWidth - 1, Math.max(0, maxX - thickness));
            let drawingMinY = Math.min(imageDataHeight - 1, Math.max(0, minY + thickness));
            let drawingMaxY = Math.min(imageDataHeight - 1, Math.max(0, maxY - thickness));
            Rectangle.drawRectangle(drawingMinX, drawingMaxX, drawingMinY, drawingMaxY, color, image);
        }
        /**
         * Draw a rectangle in a image, given its x and y bounds.
         *
         * @param {number} minX     The minimal x coordinate of the rectangle.
         * @param {number} maxX     The maximal x coordinate of the rectangle.
         * @param {number} minY     The minimal y coordinate of the rectangle.
         * @param {number} maxY     The maximal y coordinate of the rectangle.
         * @param {Color} color     The color of the rectangle.
         * @param {ImageData} image The image where the rectangle will be drawn.
         *
         * @author Mathieu Fehr
         */
        static drawRectangle(minX, maxX, minY, maxY, color, image) {
            for (let i = minY; i <= maxY; i++) {
                for (let j = minX; j <= maxX; j++) {
                    image.data[4 * (i * image.width + j)] = color.red;
                    image.data[4 * (i * image.width + j) + 1] = color.green;
                    image.data[4 * (i * image.width + j) + 2] = color.blue;
                    image.data[4 * (i * image.width + j) + 3] = color.alpha;
                }
            }
        }
    }
    exports.Rectangle = Rectangle;
});