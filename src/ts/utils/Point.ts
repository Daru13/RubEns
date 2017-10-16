/**
 * 2D Point data type.
 */
export class Point {

    /**
     * The coordinate of the X axis.
     */
    x: number;


    /**
     * The coordinate of the X axis.
     */
    y: number;


    /**
     * Instanciates and initializes a new Point object.
     * @param {number} x    X coordinate.
     * @param {number} y    Y coordinate.
     *
     * @author Mathieu Fehr
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    /**
     * Compute the euclidean distance to another point..
     * @param {Point} other The other point.
     *
     * @author Mathieu Fehr
     */
    distanceTo(other: Point) {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
    }
}
