import { Color } from "../utils/Color";

/**
 * Class containing functions used to apply color effects to images.
 */
export class ColorEffects {

    /**
     * Convert the color image into a grayscale image, using the lightness function.
     *
     * @param {ImageData} image     The image on which the effect is applied.
     *
     * @author Mathieu Fehr
     */
    static toGrayscaleWithLightness(image: ImageData) {
        let toGreyFunction = (oldColor: Color): Color => {
            let grey = Math.round((Math.max(oldColor.red, oldColor.green, oldColor.blue) +
                        Math.min(oldColor.red, oldColor.green, oldColor.blue)) / 2);
            return new Color(grey, grey, grey, oldColor.alpha);
        };
        ColorEffects.changeColorsWithFunction(image, toGreyFunction);
    }

    /**
     * Convert the color image into a grayscale image, using the average function.
     *
     * @param {ImageData} image     The image on which the effect is applied.
     *
     * @author Mathieu Fehr
     */
    static toGrayscaleWithAverage(image: ImageData) {
        let toGreyFunction = (oldColor: Color): Color => {
            let grey = Math.round((oldColor.red + oldColor.green + oldColor.blue) / 3);
            return new Color(grey, grey, grey, oldColor.alpha);
        };
        ColorEffects.changeColorsWithFunction(image, toGreyFunction);
    }


    /**
     * Convert the color image into a grayscale image, using the luminosity function.
     *
     * @param {ImageData} image     The image on which the effect is applied.
     *
     * @author Mathieu Fehr
     */
    static toGrayscaleWithLuminosity(image: ImageData) {
        let toGreyFunction = (oldColor: Color): Color => {
            let grey =  0.21 * oldColor.red + 0.72 * oldColor.green + 0.07 * oldColor.blue;
            return new Color(grey, grey, grey, oldColor.alpha);
        };
        ColorEffects.changeColorsWithFunction(image, toGreyFunction);
    }

    /**
     * Inverse the colors of the image.
     *
     * @param {ImageData} image     The image on which the effect is applied.
     *
     * @author Mathieu Fehr
     */
    static inverseColors(image: ImageData) {
        let changeColorFunction = (oldColor: Color): Color => {
            return new Color(255-oldColor.red, 255-oldColor.green, 255-oldColor.blue, oldColor.alpha);
        };
        ColorEffects.changeColorsWithFunction(image, changeColorFunction);
    }

    /**
     * Apply a function to every pixels of the image.
     *
     * @param {ImageData} image                                 The image on which the effect is applied.
     * @param {(color: Color) => Color} colorChangeFunction     The function to apply on every pixels.
     *
     * @author Mathieu Fehr
     */
    static changeColorsWithFunction(image: ImageData, colorChangeFunction: (color: Color) => Color) {
        // We apply the operation to every pixels
        for(let position = 0; position < image.data.length / 4; position++) {
            // We get the color of the pixel
            let red = image.data[4 * position];
            let green = image.data[4 * position + 1];
            let blue = image.data[4 * position + 2];
            let alpha = image.data[4 * position + 3];
            let oldColor = new Color(red, green, blue, alpha);

            // And we compute the new color
            let newColor = colorChangeFunction(oldColor);
            image.data[4 * position] = newColor.red;
            image.data[4 * position + 1] = newColor.green;
            image.data[4 * position + 2] = newColor.blue;
            image.data[4 * position + 3] = newColor.alpha;
        }
    }
}