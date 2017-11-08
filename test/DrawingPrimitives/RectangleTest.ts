import { Point } from "../../src/ts/utils/Point";
import {Rectangle} from "../../src/ts/DrawingPrimitives/Rectangle";
import {Color} from "../../src/ts/utils/Color";

const assert = require("assert");
require("jsdom-global")();

describe("Test of Rectangle drawing primitives:", function() {

    let imageData: ImageData;

    const black = new Color(0,0,0,255);
    const imageSize = 31;

    /**
     * Create an ImageData object to draw on it for testing.
     */
    beforeEach(function() {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 31;
        htmlCanvas.height = 31;
        imageData = htmlCanvas.getContext("2d").getImageData(0,0,31,31);
    });


    describe("Check that a borderless rectangle is filled", function() {

        it("Draw from top left to bottom right", function() {
            Rectangle.drawWithBorders(new Point(10,10), new Point(20,20), black, black, 0, imageData);

            for(let i = 10; i<20; i++) {
                for(let j = 10; j<20; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from top right to bottom left", function() {
            Rectangle.drawWithBorders(new Point(20, 10), new Point(10, 20), black, black, 0, imageData);

            for(let i = 10; i<20; i++) {
                for(let j = 10; j<20; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom left to top right", function() {
            Rectangle.drawWithBorders(new Point(10, 20), new Point(20, 10), black, black, 0, imageData);

            for(let i = 10; i<20; i++) {
                for(let j = 10; j<20; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom right to top left", function() {
            Rectangle.drawWithBorders(new Point(20, 20), new Point(10, 10), black, black, 0, imageData);

            for(let i = 10; i<20; i++) {
                for(let j = 10; j<20; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });
    });


    describe("Check that a bordered rectangle is colored correctly", function() {

        it("Draw from top left to bottom right", function() {
            Rectangle.drawWithBorders(new Point(10,10), new Point(20,20), black, black, 5, imageData);

            for(let i = 8; i<=22; i++) {
                for(let j = 8; j<=22; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from top right to bottom left", function() {
            Rectangle.drawWithBorders(new Point(20, 10), new Point(10, 20), black, black, 5, imageData);

            for(let i = 8; i<=22; i++) {
                for(let j = 8; j<=22; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom left to top right", function() {
            Rectangle.drawWithBorders(new Point(10, 20), new Point(20, 10), black, black, 5, imageData);

            for(let i = 8; i<=22; i++) {
                for(let j = 8; j<=22; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom right to top left", function() {
            Rectangle.drawWithBorders(new Point(20, 20), new Point(10, 10), black, black, 5, imageData);

            for(let i = 8; i<=22; i++) {
                for(let j = 8; j<=22; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });
    });
});