

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
     * Instantiates and initializes a new SelectedArea object, given a width and a height
     * @param {number} width    The width of the SelectedArea
     * @param {number} height   The height of the SelectedArea
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(width * height);
        this.reset();
    }


    /**
     * Reset the selection.
     * This is the same than selecting everything.
     */
    reset() {
        this.data.fill(255);
    }
}