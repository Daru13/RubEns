export class Color {
    red  : number;
    green: number;
    blue : number;
    alpha: number = 255;

    /**
     * Returns a new Color object from given red, green and blue values, and from
     * an optionnal alpha value (opaque by default).
     * @param red       Red intensity (0-255).
     * @param green     Green intensity (0-255).
     * @param blue      Green intensity (0-255).
     * @param alpha     Optionnal alpha intensity (0-255).
     * @return Color object with the given intensities.
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
