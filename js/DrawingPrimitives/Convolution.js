define(["require", "exports", "../utils/Color", "../utils/Matrix"], function (require, exports, Color_1, Matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class used to apply convolution on image data.
     */
    class Convolution {
        /**
         * Convolve a matrix to an image data.
         * The image is reverse in the borders, in order to have the convolution defined everywhere.
         * The convolution matrix is expected to be correct (which mean that every line should have the same size).
         * The convolution matrix height and width should also be odd.
         *
         * @param {Matrix} kernel       The matrix to convolve with the image
         * @param {ImageData} image     The image where the convolution is done
         */
        static convolve(kernel, image) {
            // We check that the height and width is odd
            if (kernel.height % 2 == 0 || kernel.width % 2 == 0) {
                console.error("Convolution should be made with a matrix that has odd height and width");
                return;
            }
            // We check that the convolution matrix is small enough
            if ((kernel.height - 1) / 2 > image.height || (kernel.width - 1) / 2 > image.width) {
                console.error("The convolution matrix is too big to convolve the image");
                return;
            }
            let newArray = new Uint8ClampedArray(image.data.length);
            // We compute the result value for every pixel of the image
            for (let position = 0; position < image.data.length / 4; position++) {
                let y = Math.floor(position / image.width);
                let x = position % image.width;
                let newColor = new Color_1.Color(0, 0, 0, 0);
                // We compute the new pixel color by convolving the matrix with the pixel's neighbors.
                for (let dy = -(kernel.height - 1) / 2; dy <= (kernel.height - 1) / 2; dy++) {
                    for (let dx = -(kernel.width - 1) / 2; dx <= (kernel.width - 1) / 2; dx++) {
                        // If the pixel is outside of the borders,
                        // we get the mirrored pixel
                        let pixelX = (x + dx);
                        if (pixelX < 0) {
                            pixelX *= -1;
                        }
                        else if (pixelX >= image.width) {
                            pixelX = 2 * image.width - 2 - pixelX;
                        }
                        let pixelY = (y + dy);
                        if (pixelY < 0) {
                            pixelY *= -1;
                        }
                        else if (pixelY >= image.height) {
                            pixelY = 2 * image.height - 2 - pixelY;
                        }
                        let neighborPosition = pixelX + image.width * pixelY;
                        let kernelY = dy + (kernel.height - 1) / 2;
                        let kernelX = dx + (kernel.width - 1) / 2;
                        let alpha = image.data[4 * neighborPosition + 3];
                        let neighborColorFactor = alpha * kernel.data[kernelY][kernelX];
                        newColor.red += neighborColorFactor * image.data[4 * neighborPosition];
                        newColor.green += neighborColorFactor * image.data[4 * neighborPosition + 1];
                        newColor.blue += neighborColorFactor * image.data[4 * neighborPosition + 2];
                        newColor.alpha += neighborColorFactor;
                    }
                }
                // We set the new color
                if (newColor.alpha == 0) {
                    newArray[4 * position + 3] = 0;
                }
                else {
                    newArray[4 * position] = Math.round(newColor.red / newColor.alpha);
                    newArray[4 * position + 1] = Math.round(newColor.green / newColor.alpha);
                    newArray[4 * position + 2] = Math.round(newColor.blue / newColor.alpha);
                    newArray[4 * position + 3] = Math.round(newColor.alpha);
                }
            }
            // We set the new colors to the image data.
            image.data.set(newArray);
        }
        /**
         * Create a gaussian kernel
         *
         * @param {number} sigma    The standard deviation. This value should be positive.
         * @param {number} width    The width of the kernel, should be odd.
         * @param {number} height   The height of the kernel, should be odd.
         * @returns {Matrix}        The kernel.
         *
         * @author Mathieu Fehr
         */
        static createGaussianKernel(sigma, width, height) {
            let kernel = new Matrix_1.Matrix(width, height);
            let halfWidth = (width - 1) / 2;
            let halfHeight = (height - 1) / 2;
            let twoSigmaSquared = 2 * sigma * sigma;
            let normalizationFactor = 1 / Math.sqrt(Math.PI * twoSigmaSquared);
            for (let i = -halfHeight; i <= halfHeight; i++) {
                for (let j = -halfWidth; j <= halfWidth; j++) {
                    let distanceSquared = i * i + j * j;
                    kernel.data[i + halfHeight][j + halfWidth] = normalizationFactor * Math.exp(-distanceSquared / twoSigmaSquared);
                }
            }
            kernel.setNewSum(1);
            return kernel;
        }
        /**
         * Create a kernel doing a mean filter.
         *
         * @param {number} width    The width of the kernel. The width should be odd.
         * @param {number} height   The height of the kernel. The height should be odd.
         * @returns {Matrix}        The kernel
         *
         * @author Mathieu Fehr
         */
        static createMeanKernel(width, height) {
            let kernel = new Matrix_1.Matrix(width, height);
            let sizeSquaredInv = 1 / (width * height);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    kernel.data[i][j] = sizeSquaredInv;
                }
            }
            return kernel;
        }
        /**
         * Get the size of a gaussian kernel, given sigma
         *
         * @param {number} sigma    The standard deviation of the gaussian kernel.
         * @returns {number}        The size of the gaussian kernel.
         */
        static getGaussianKernelSize(sigma) {
            // We compute the size of the kernel
            let size = Math.ceil(sigma * 3);
            if (size % 2 === 0) {
                size += 1;
            }
            return size;
        }
    }
    exports.Convolution = Convolution;
});
