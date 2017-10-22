

export class SelectedArea {

    /**
     * The data representing the selection.
     * The value of each cell represent the alpha
     */
    data: Uint8Array;

    /**
     * The width of the image where the selection is applied
     */
    width: Number;

    /**
     * The height of the image where the selection is applied
     */
    height: Number;

    /**
     * Instantiates and initializes a new SelectedArea object, given a width and a height
     * @param {number} width    The width of the SelectedArea
     * @param {number} height   The height of the SelectedArea
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(width * height);
    }
}