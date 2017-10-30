import { Line } from "../../src/ts/DrawingPrimitives/Line";
import { Point } from "../../src/ts/utils/Point";

const assert = require("assert");
require("jsdom-global")();

describe("Test of Rectangle drawing primitives:", function() {

    let imageData: ImageData;

    /**
     * Create an ImageData object to draw on it for testing.
     */
    beforeEach(function() {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 31;
        htmlCanvas.height = 31;
        imageData = htmlCanvas.getContext("2d").getImageData(0,0,31,31);
    });

    describe("Check that the zone is filled", function() {

    });
});