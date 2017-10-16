/**
 * Color data type.
 *
 * It internally uses the RGB format.
 */
export class Color {
    /**
     * Red component of the color.
     */
    red  : number;

    /**
     * Green component of the color.
     */
    green: number;

    /**
     * Blue component of the color.
     */
    blue : number;

    /**
     * Alpha (opacity) component of the color.
     * 0 is transparent, 255 is opaque.
     */
    alpha: number = 255;

    /**
     * Instanciates and initializes a new Color object from given red, green and blue values,
     * and from an optionnal alpha value (opaque by default).
     * @param {number} red       Red intensity (0-255).
     * @param {number} green     Green intensity (0-255).
     * @param {number} blue      Green intensity (0-255).
     * @param {number} alpha     Optionnal alpha intensity (0-255).
     * @return                   Fresh Color object with the given intensities.
     *
     * @author Camille Gobert
     */
    constructor (red: number, green: number, blue: number, alpha: number = 255) {
        this.red   = red;
        this.green = green;
        this.blue  = blue;
        this.alpha = alpha;
    }

    // TODO: add useful methods, e.g. from/to hex string or from/to HSL values
}
