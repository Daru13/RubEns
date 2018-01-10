import { Line } from "../../src/ts/DrawingPrimitives/Line";
import { Point } from "../../src/ts/utils/Point";
import { Color } from "../../src/ts/utils/Color";

const assert = require("assert");
require("jsdom-global")();

describe("Test of Line drawing primitives:", function() {

    let imageData: ImageData;

    const black = new Color(0,0,0,255);

    /**
     * Create an ImageData object to draw on it for testing.
     */
    beforeEach(function() {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 31;
        htmlCanvas.height = 31;
        imageData = htmlCanvas.getContext("2d").getImageData(0,0,31,31);
    });


    describe("Check that the line is colored between the two points:", function() {

        /**
         * Draw a horizontal line for each direction and check that the points in the line are changed.
         */
        it("When drawing horizontal lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(15, 5), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.notEqual(imageData.data[4 * (i + 5 * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(15, 15), new Point(5, 15), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.notEqual(imageData.data[4 * (i + 15 * 31) + 3], 0);
            }

        });


        /**
         * Draw a vertical line for each direction and check that the points in the line are changed.
         */
        it("When drawing vertical lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(5, 15), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.notEqual(imageData.data[4 * (5 + i * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(15, 15), new Point(15, 5), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.notEqual(imageData.data[4 * (15 + i * 31) + 3], 0);
            }
        });


        /**
         * Draw a diagonal line for each direction and check that the points in the diagonals are changed.
         */
        it("When drawing diagonal lines", function () {
            Line.draw(imageData, new Point(0, 0), new Point(10, 10), 1, black);
            for (let i = 0; i <= 10; i++) {
                assert.notEqual(imageData.data[4 * (i + 31 * i) + 3], 0);
            }

            Line.draw(imageData, new Point(30, 30), new Point(20, 20), 1, black);
            for (let i = 20; i <= 30; i++) {
                assert.notEqual(imageData.data[4 * (i + 31 * i) + 3], 0);
            }

            Line.draw(imageData, new Point(0, 30), new Point(10, 20), 1, black);
            for (let i = 0; i <= 10; i++) {
                let j = 30 - i;
                assert.notEqual(imageData.data[4 * (i + 31 * j) + 3], 0);
            }

            Line.draw(imageData, new Point(30, 0), new Point(20, 10), 1, black);
            for (let i = 0; i <= 10; i++) {
                let j = 30 - i;
                assert.notEqual(imageData.data[4 * (j + 31 * i) + 3], 0);
            }
        });

    });


    describe("Check that the line do not go beyond the two points", function() {

        /**
         * Draw a horizontal line for each direction and check that the point just next to the line
         * segment are not changed.
         */
        it("When drawing horizontal lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(15, 5), 1, black);
            assert.equal(imageData.data[4 * (3 + 5 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (18 + 5 * 31) + 3], 0);

            Line.draw(imageData, new Point(15, 15), new Point(5, 15), 1, black);
            assert.equal(imageData.data[4 * (15 + 18 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (15 + 3 * 31) + 3], 0);
        });


        /**
         * Draw a vertical line for each direction and check that the point just next to the line
         * segment are not changed.
         */
        it("When drawing vertical lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(5, 15), 1, black);
            assert.equal(imageData.data[4 * (5 + 3 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (5 + 17 * 31) + 3], 0);

            Line.draw(imageData, new Point(15, 15), new Point(5, 15), 1, black);
            assert.equal(imageData.data[4 * (17 + 15 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (3 + 15 * 31) + 3], 0);
        });


        /**
         * Draw a diagonal line for each direction and check that the point just next to the line
         * segment are not changed.
         */
        it("When drawing diagonal lines", function () {
            Line.draw(imageData, new Point(3, 3), new Point(7, 7), 1, black);
            assert.equal(imageData.data[4 * (0 + 0 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (11 + 11 * 31) + 3], 0);

            Line.draw(imageData, new Point(27, 27), new Point(23, 23), 1, black);
            assert.equal(imageData.data[4 * (30 + 30 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (19 + 19 * 31) + 3], 0);

            Line.draw(imageData, new Point(3, 27), new Point(8, 18), 1, black);
            assert.equal(imageData.data[4 * (0 + 29 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (11 + 21 * 31) + 3], 0);

            Line.draw(imageData, new Point(27, 3), new Point(17, 7), 1, black);
            assert.equal(imageData.data[4 * (30 + 0 * 31) + 3], 0);
            assert.equal(imageData.data[4 * (19 + 9 * 31) + 3], 0);
        });

    });



    describe("Check that the line has a correct thickness", function() {

        /**
         * Check that the top and bottom line are not colored when drawing a horizontal line.
         */
        it("When drawing horizontal lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(15, 5), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.equal(imageData.data[4 * (i + 2 * 31) + 3], 0);
                assert.equal(imageData.data[4 * (i + 8 * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(15, 15), new Point(5, 15), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.equal(imageData.data[4 * (i + 12 * 31) + 3], 0);
                assert.equal(imageData.data[4 * (i + 18 * 31) + 3], 0);
            }
        });


        /**
         * Check that the top and bottom line are not colored when drawing a vertical line.
         */
        it("When drawing vertical lines", function () {
            Line.draw(imageData, new Point(5, 5), new Point(5, 15), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.equal(imageData.data[4 * (2 + i * 31) + 3], 0);
                assert.equal(imageData.data[4 * (8 + i * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(15, 15), new Point(15, 5), 1, black);
            for (let i = 5; i <= 15; i++) {
                assert.equal(imageData.data[4 * (12 + i * 31) + 3], 0);
                assert.equal(imageData.data[4 * (18 + i * 31) + 3], 0);
            }
        });


        /**
         * Check that the top and bottom line are not colored when drawing a diagonal line.
         */
        it("When drawing diagonal lines", function () {
            Line.draw(imageData, new Point(3, 3), new Point(8, 8), 1, black);
            for (let i = 3; i <= 8; i++) {
                assert.equal(imageData.data[4 * (i - 3 + (i + 3) * 31) + 3], 0);
                assert.equal(imageData.data[4 * (i + 3 + (i - 3) * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(27, 27), new Point(22, 22), 1, black);
            for (let i = 22; i <= 27; i++) {
                assert.equal(imageData.data[4 * (i - 3 + (i + 3) * 31) + 3], 0);
                assert.equal(imageData.data[4 * (i + 3 + (i - 3) * 31) + 3], 0);
            }

            Line.draw(imageData, new Point(3, 27), new Point(8, 18), 1, black);
            for (let i = 1; i <= 10; i++) {
                assert.equal(imageData.data[4 * (i - 3) + (27 - i + 3) + 3], 0);
                assert.equal(imageData.data[4 * (i + 3) + (27 - i - 3) + 3], 0);
            }

            Line.draw(imageData, new Point(27, 3), new Point(22, 8), 1, black);
            for (let i = 1; i <= 10; i++) {
                assert.equal(imageData.data[4 * (27 - i + 3) + (i - 3) + 3], 0);
                assert.equal(imageData.data[4 * (27 - i - 3) + (i + 3) + 3], 0);
            }
        })
    });
});
