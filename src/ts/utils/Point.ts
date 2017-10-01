/**
 * Class representing a point
 */
export class Point {

    /**
     * The coordinate in the x axis
     */
    x: number;


    /**
     * The coordinate in the y axis
     */
    y: number;


    /**
     * Construct a new point
     *
     * @param {number} x    The coordinate in the x axis
     * @param {number} y    The coordinate in the y axis
     *
     * @author Mathieu Fehr
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    /**
     * Get the euclidean distance between two points
     *
     * @param {Point} other     The other point
     *
     * @author Mathieu Fehr
     */
    distanceTo(other: Point) {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
    }
}