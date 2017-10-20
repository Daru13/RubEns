import { Line } from "../../src/ts/DrawingPrimitives/Line";
import { Point } from "../../src/ts/utils/Point";

const assert = require('assert');
require('jsdom-global')();

describe('Test of Line drawing primitives', function() {

    let imageData: ImageData;

    before(function() {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 30;
        htmlCanvas.height = 30;
        imageData = htmlCanvas.getContext("2d").getImageData(0,0,30,30);
    });


    it('should correctly draw a diagonal line', function () {
        Line.draw(imageData, new Point(0,0), new Point(10,10), Line.paintItBlack);
        for(let i = 0; i<=10; i++) {
            assert.notEqual(imageData.data[4*(i + 30*i) + 3], 0);
        }
    });

});