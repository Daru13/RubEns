define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 2D Point data type.
     */
    class Point {
        /**
         * Instanciates and initializes a new Point object.
         * @param {number} x    X coordinate.
         * @param {number} y    Y coordinate.
         *
         * @author Mathieu Fehr
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * Compute the euclidean distance to another point..
         * @param {Point} other The other point.
         *
         * @author Mathieu Fehr
         */
        distanceTo(other) {
            return Math.sqrt(Math.pow((this.x - other.x), 2) + Math.pow((this.y - other.y), 2));
        }
        /**
         * Compute the euclidean distance squared to another point.
         * @param {Point} other The other point
         *
         * @author Mathieu Fehr
         */
        distanceTo2(other) {
            return Math.pow((this.x - other.x), 2) + Math.pow((this.y - other.y), 2);
        }
    }
    exports.Point = Point;
});
