import { Color } from "../utils/Color";
import { Matrix } from "../utils/Matrix";

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
     * @param {Matrix} matrix       The matrix to convolve with the image
     * @param {ImageData} image     The image where the convolution is done
     */
    static convolve(matrix: Matrix, image: ImageData) {

        // We check that the height and width is odd
        if (matrix.height % 2 == 0 || matrix.width % 2 == 0) {
            console.error("Convolution should be made with a matrix that has odd height and width");
            return;
        }

        // We check that the convolution matrix is small enough
        if ((matrix.height - 1) / 2 > image.height || (matrix.width - 1) / 2 > image.width) {
            console.error("The convolution matrix is too big to convolve the image");
            return;
        }

        let newArray = new Uint8ClampedArray(image.data.length);

        // We compute the result value for every pixel of the image
        for (let position = 0; position < image.data.length / 4; position++) {
            let y = Math.floor(position / image.width);
            let x = position % image.width;

            let newColor = new Color(0, 0, 0, 0);

            // We compute the new pixel color by convolving the matrix with the pixel's neighbors.
            for (let dy = -(matrix.height - 1) / 2; dy++; dy <= (matrix.height - 1) / 2) {
                for (let dx = -(matrix.width - 1) / 2; dx++; dx <= (matrix.width - 1) / 2) {

                    // If the pixel is outside of the borders,
                    // we get the mirrored pixel
                    let pixelX = (x + dx);
                    if (pixelX < 0) {
                        pixelX *= -1;
                    } else if(pixelX >= image.width) {
                        pixelX = 2 * image.width - 2 - pixelX;
                    }

                    let pixelY = (y + dy);
                    if (pixelY < 0) {
                        pixelY *= -1;
                    } else if(pixelY >= image.height) {
                        pixelY = 2 * image.height - 2 - pixelY;
                    }

                    let neighborPosition = pixelX + image.width * pixelY;

                    newColor.red += matrix[dy][dx] * image[4 * neighborPosition];
                    newColor.green += matrix[dy][dx] * image[4 * neighborPosition + 1];
                    newColor.blue += matrix[dy][dx] * image[4 * neighborPosition + 2];
                    newColor.alpha += matrix[dy][dx] * image[4 * neighborPosition + 3];
                }
            }

            let pixelPosition = x + image.width * y;

            // We set the new color
            newArray[4 * pixelPosition] = newColor.red;
            newArray[4 * pixelPosition + 1] = newColor.green;
            newArray[4 * pixelPosition + 2] = newColor.blue;
            newArray[4 * pixelPosition + 3] = newColor.alpha;
        }

        // We set the new colors to the image data.
        image.data.set(newArray);
    }

    /**
     * Create a gaussian kernel
     *
     * @param {number} size     The size of the kernel. The size should be odd.
     * @param {number} sigma    The standard deviation. This value should be positive.
     * @returns {Matrix}        The kernel.
     *
     * @author Mathieu Fehr
     */
    static createGaussianKernel(size: number, sigma: number): Matrix {
        if(sigma <= 0) {
            console.error("The standard deviation of the gaussian kernel should be positive.");
            return null;
        }
        if(size <= 0) {
            console.error("The size of the kernel should be positive.");
            return null;
        }
        if(size % 2 == 0) {
            console.error("The size of the kernel should be odd.");
            return null;
        }

        let kernel = new Matrix(size, size);

        let halfSize = (size - 1) / 2;
        let twoSigmaSquared = 2 * sigma * sigma;
        let normalizationFactor = 1 / Math.sqrt(Math.PI * twoSigmaSquared);

        for(let i = -halfSize; i <= halfSize; i++) {
            for(let j = -halfSize; j <= halfSize; j++) {
                let distanceSquared = i*i + j*j;
                kernel[i + halfSize][j + halfSize] = normalizationFactor * Math.exp(-distanceSquared / twoSigmaSquared);
            }
        }

        kernel.setNewSum(1);
        return kernel;
    }


    /**
     * Create a kernel doing a mean filter.
     *
     * @param {number} size     The size of the kernel. The size should be odd.
     * @returns {Matrix}        The kernel
     *
     * @author Mathieu Fehr
     */
    static createMeanKernel(size: number): Matrix {
        if(size <= 0) {
            console.error("The size of the kernel should be positive.");
            return null;
        }
        if(size % 2 == 0) {
            console.error("The size of the kernel should be odd.");
            return null;
        }

        let kernel = new Matrix(size, size);
        let sizeSquaredInv = 1 / (size*size);

        for(let i = 0; i<size; i++) {
            for(let j = 0; j<size; j++) {
                kernel[i][j] = sizeSquaredInv;
            }
        }

        return kernel;
    }

    /**
     * Create a kernel doing an identity filer.
     *
     * @param {number} size     The size of the kernel. The size should be odd.
     * @returns {Matrix}        The kernel.
     *
     * @author Mathieu Fehr
     */
    static createIdentityKernel(size: number): Matrix {
        if(size <= 0) {
            console.error("The size of the kernel should be positive.");
            return null;
        }
        if(size % 2 == 0) {
            console.error("The size of the kernel should be odd.");
            return null;
        }

        let kernel = new Matrix(size, size);
        for(let i = 0; i<size; i++) {
            for(let j = 0; j<size; j++) {
                kernel[i][j] = 0;
            }
        }
        kernel[(size-1)/2][(size-1)/2] = 1;

        return kernel;
    }

    /**
     * Create a kernel sharpening the image.
     *
     * @param {number} size     The size of the kernel. The size should be odd.
     * @param {number} sigma    The standard deviation of the gaussian kernel
     * @returns {Matrix}        The kernel.
     */
    static createSharpenKernel(size: number, sigma: number): Matrix {
        if(size <= 0) {
            console.error("The size of the kernel should be positive.");
            return null;
        }
        if(size % 2 == 0) {
            console.error("The size of the kernel should be odd.");
            return null;
        }

        let blurKernel = Convolution.createGaussianKernel(size, sigma);
        let identityKernel = Convolution.createIdentityKernel(size);

        return identityKernel.scalarMultiplication(2).subtract(blurKernel);
    }
}