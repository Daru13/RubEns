import {Color} from "../../src/ts/utils/Color";
import {Ellipse} from "../../src/ts/DrawingPrimitives/Ellipse";
import {Point} from "../../src/ts/utils/Point";

const assert = require("assert");
require("jsdom-global")();

describe("Test of Rectangle drawing primitives:", function() {

    let imageData: ImageData;

    const black = new Color(0, 0, 0, 255);
    const imageSize = 31;

    /**
     * Create an ImageData object to draw on it for testing.
     */
    beforeEach(function () {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 31;
        htmlCanvas.height = 31;
        imageData = htmlCanvas.getContext("2d").getImageData(0, 0, 31, 31);
    });

    describe("The ellipse should be draw on the screen", function () {

        it("Draw from top left to bottom right", function() {
            Ellipse.drawFromBoundingRect(new Point(10,10), new Point(20,20), black, 0, black, imageData);

            for(let i = 13; i<=17; i++) {
                for(let j = 13; j<=17; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from top right to bottom left", function() {
            Ellipse.drawFromBoundingRect(new Point(20,10), new Point(10,20), black, 0, black, imageData);

            for(let i = 13; i<=17; i++) {
                for(let j = 13; j<=17; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom left to top right", function() {
            Ellipse.drawFromBoundingRect(new Point(10,20), new Point(20,10), black, 0, black, imageData);

            for(let i = 13; i<=17; i++) {
                for(let j = 13; j<=17; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });

        it("Draw from bottom right to top left", function() {
            Ellipse.drawFromBoundingRect(new Point(20,20), new Point(10,10), black, 0, black, imageData);

            for(let i = 13; i<=17; i++) {
                for(let j = 13; j<=17; j++) {
                    assert.notEqual(imageData.data[(i + j * imageSize) * 4 + 3], 0);
                }
            }
        });
    });
});