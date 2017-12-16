import { Color } from "../utils/Color";


/**
 * Class used to apply convolution on image data.
 */
export class Convolution {

    /**
     * Convolve a matrix to an image data.
     * The image is reverse in the borders, in order to have the convolution defined everywhere.
     * The convolution matrix is expected to be correct (which mean that every line should have the same size).
     * The convolution matrix height and width should also be odd.
     *
     * @param {Array<Array<number>>} matrix The matrix to convolve with the image
     * @param {ImageData} imageData         The image where the convolution is done
     */
    static convolve(matrix: Array<Array<number>>, imageData: ImageData) {

        let matrixWidth = matrix[0].length;
        let matrixHeight = matrix.length;

        // We check that the height and width is odd
        if(matrixHeight % 2 == 0 || matrixWidth % 2 == 0) {
            console.error("Convolution should be made with a matrix that has odd height and width");
        }

        let imageWidth = imageData.width;

        let newArray = new Uint8ClampedArray(imageData.data.length);

        // We compute the result value for every pixel of the image
        for(let position = 0; position < imageData.data.length / 4; position++) {
            let y = Math.floor(position / imageWidth);
            let x = position % imageWidth;

            let newColor = new Color(0,0,0,0);

            // We compute the new pixel color by convolving the matrix with the pixel's neighbors.
            for(let dy = -(matrixHeight-1)/2; dy++; dy <= (matrixHeight-1)/2) {
                for(let dx = -(matrixWidth-1)/2; dx++; dx <= (matrixWidth-1)/2) {

                    // If the pixel is outside of the borders,
                    // we get the mirrored pixel
                    let pixelX = (x+dx);
                    if(pixelX < 0) {
                        pixelX *= -1;
                    }
                    let pixelY = (y+dy);
                    if(pixelY < 0) {
                        pixelY *= -1;
                    }

                    let neighborPosition = pixelX + imageWidth * pixelY;

                    newColor.red   += matrix[dy][dx] * imageData[4 * neighborPosition    ];
                    newColor.green += matrix[dy][dx] * imageData[4 * neighborPosition + 1];
                    newColor.blue  += matrix[dy][dx] * imageData[4 * neighborPosition + 2];
                    newColor.alpha += matrix[dy][dx] * imageData[4 * neighborPosition + 3];
                }
            }

            let pixelPosition = x + imageWidth * y;

            // We set the new color
            newArray[4 * pixelPosition] = newColor.red;
            newArray[4 * pixelPosition + 1] = newColor.green;
            newArray[4 * pixelPosition + 2] = newColor.blue;
            newArray[4 * pixelPosition + 3] = newColor.alpha;
        }

        // We set the new colors to the image data.
        imageData.data.set(newArray);
    }
}