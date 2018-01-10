define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Matrix {
        /**
         * Construct a null matrix with given width and height
         *
         * @param width     The width of the matrix
         * @param height    The height of the matrix
         */
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.data = [];
            for (let i = 0; i < height; i++) {
                this.data.push(new Array(width));
            }
        }
        /**
         * Add another matrix to this matrix.
         * The matrices should have the same size.
         *
         * @param {Matrix} other    The other matrix.
         * @returns {Matrix}        The resulting matrix.
         *
         * @author Mathieu Fehr
         */
        add(other) {
            if (other.height != this.height || other.width != this.width) {
                console.error("Both matrices should have the same size.");
            }
            let result = new Matrix(this.width, this.height);
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    result.data[i][j] = this.data[i][j] + other.data[i][j];
                }
            }
            return result;
        }
        /**
         * Subtract another matrix to this matrix.
         * The matrices should have the same size.
         *
         * @param {Matrix} other    The other matrix.
         * @returns {Matrix}        The resulting matrix.
         *
         * @author Mathieu Fehr
         */
        subtract(other) {
            if (other.height != this.height || other.width != this.width) {
                console.error("Both matrices should have the same size.");
            }
            let result = new Matrix(this.width, this.height);
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    result.data[i][j] = this.data[i][j] - other.data[i][j];
                }
            }
            return result;
        }
        /**
         * Multiply the matrix with a scalar
         *
         * @param {number} scalar   The coefficient multiplying the matrix.
         * @returns {Matrix}        The resulting matrix.
         *
         * @author Mathieu Fehr
         */
        scalarMultiplication(scalar) {
            let result = new Matrix(this.width, this.height);
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    result.data[i][j] = this.data[i][j] * scalar;
                }
            }
            return result;
        }
        /**
         * Apply a scalar multiplication to the matrix to have a new sum of weights.
         * If the old sum of weights is zero, no operation is done.
         *
         * @param {number} newSum  The new sum of weights.
         */
        setNewSum(newSum) {
            let oldSum = 0;
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    oldSum += this.data[i][j];
                }
            }
            if (oldSum == 0) {
                return;
            }
            this.data = this.scalarMultiplication(newSum / oldSum).data;
        }
    }
    exports.Matrix = Matrix;
});
