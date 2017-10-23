/**
 * Class representing a selected area in the image.
 * The area is represented by an array of integers between 0 and 255.
 * A value of 255 represent a selected pixel, and a value of 0 represent a non selected pixel.
 * The values between represent a portion of the pixel selected.
 */
export class SelectedArea {

    /**
     * The data representing the selection.
     * The value of each cell represent the alpha
     */
    data: Uint8Array;

    /**
     * The width of the image where the selection is applied
     */
    width: number;

    /**
     * The height of the image where the selection is applied
     */
    height: number;

    /**
     * Instantiates and initializes a new SelectedArea object, given a width and a height.
     * By default, no pixel are selected.
     * @param {number} width    The width of the SelectedArea
     * @param {number} height   The height of the SelectedArea
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(width * height);
    }


    /**
     * Select every pixel in the image.
     *
     * @author Mathieu Fehr
     */
    selectEverything() {
        this.data.fill(255);
    }


    /**
     * Select no pixel in the image.
     *
     * @author Mathieu Fehr
     */
    selectNothing() {
        this.data.fill(0);
    }
}