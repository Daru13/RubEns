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
    alpha: number;

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

    /**
     * Return a new Color object initialized to opaque black.
     * @return {Color} Fresh Color object with the given color.
     *
     * @author Camille Gobert
     */
    static buildBlackColor () {
        return new Color(0, 0, 0, 255);
    }

    /**
     * Return a new Color object from a given hexadecimal color string.
     *
     * This method uses the [[setFromHex]] method, and thus has the same requirements.
     * @param  {string} hex The hexadecimal representation of the initial color to set.
     * @return {Color}      Fresh Color object with the given color.
     *
     * @author Camille Gobert
     */
    static buildFromHex (hex: string) {
        let newColor = Color.buildBlackColor();
        newColor.setFromHex(hex);

        return newColor;
    }

    /**
     * Set the color to the (always opaque) one represented by an hexadecimal string.
     *
     * It must have the syntax `#rrggbb`, where rr, gg and bb respectively are the red, green and blue
     * components of the colors encoded in base 16.
     * If the string does not match this syntax, the current color is not modified.
     * If the string is longer than 7 characters, the rest of the string is ignored.
     * @param {string} hex The hexadecimal representation of the initial color to set.
     *
     * @author Camille Gobert
     */
    setFromHex (hex: string) {
        let red   = parseInt(hex.substring(1, 3), 16);
        let green = parseInt(hex.substring(3, 5), 16);
        let blue  = parseInt(hex.substring(5, 7), 16);

        if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
            this.red   = red;
            this.green = green;
            this.blue  = blue;

            this.alpha = 255;
        }
    }
}
