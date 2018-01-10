define(["require", "exports", "../utils/Point"], function (require, exports, Point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class representing a selected area in the image.
     * The area is represented by an array of integers between 0 and 255.
     * A value of 255 represent a selected pixel, and a value of 0 represent a non selected pixel.
     * The values between represent a portion of the pixel selected.
     */
    class SelectedArea {
        /**
         * Instantiates and initializes a new SelectedArea object, given a width and a height.
         * By default, no pixel are selected.
         * @param {number} width    The width of the SelectedArea
         * @param {number} height   The height of the SelectedArea
         *
         * @author Mathieu Fehr
         */
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.data = new Uint8Array(width * height);
            this.selectionFrontier = null;
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
        /**
         * Compute the selection frontier.
         *
         * @author Mathieu Fehr
         */
        computeSelectionFrontier() {
            this.selectionFrontier = [];
            outerLoop: for (let position = 0; position < this.data.length; position++) {
                let x = position % this.width;
                let y = Math.floor(position / this.width);
                if (this.data[y * this.width + x] !== 0) {
                    continue;
                }
                for (let i = Math.max(0, y - 1); i <= Math.min(y + 1, this.height - 1); i++) {
                    for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, this.width - 1); j++) {
                        if (this.data[i * this.width + j] !== 0) {
                            this.selectionFrontier.push(new Point_1.Point(x, y));
                            continue outerLoop;
                        }
                    }
                }
            }
        }
    }
    exports.SelectedArea = SelectedArea;
});
