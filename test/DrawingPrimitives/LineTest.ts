import { Line } from "../../src/ts/DrawingPrimitives/Line";
import { Point } from "../../src/ts/utils/Point";

const assert = require("assert");
require("jsdom-global")();

describe("Test of Line drawing primitives", function() {

    let imageData: ImageData;

    before(function() {
        let htmlCanvas = document.createElement("canvas");
        htmlCanvas.width = 31;
        htmlCanvas.height = 31;
        imageData = htmlCanvas.getContext("2d").getImageData(0,0,31,31);
    });


    it("should correctly draw diagonal lines", function () {
        Line.draw(imageData, new Point(0,0), new Point(10,10), Line.paintItBlack);
        Line.draw(imageData, new Point(30,30), new Point(20,20), Line.paintItBlack);
        Line.draw(imageData, new Point(0,30), new Point(10, 20), Line.paintItBlack);
        Line.draw(imageData, new Point(30,0), new Point(20, 10), Line.paintItBlack);

        for(let i = 0; i<=10; i++) {
            assert.notEqual(imageData.data[4*(i + 31*i) + 3], 0);
        }
        for(let i = 20; i<=30; i++) {
            assert.notEqual(imageData.data[4*(i + 31*i) + 3], 0);
        }
        for(let i = 0; i<10; i++) {
            let j = 30 - i;
            assert.notEqual(imageData.data[4*(i + 31*j) + 3], 0);
        }
        for(let i = 0; i<10; i++) {
            let j = 30 - i;
            assert.notEqual(imageData.data[4*(j + 31*i) + 3], 0);
        }
    });

    it("should correctly draw horizontal lines", function() {
        Line.draw(imageData, new Point(5,5), new Point(15,5), Line.paintItBlack);
        Line.draw(imageData, new Point(15,15), new Point(5,15), Line.paintItBlack);
        for(let i = 5; i<=15; i++) {
            assert.notEqual(imageData.data[4*(i + 5*31) + 3], 0);
            assert.notEqual(imageData.data[4*(i + 15*31) + 3], 0);
        }
    });

    it("should correctly draw vertical lines", function() {
       Line.draw(imageData, new Point(5,5), new Point(5,15), Line.paintItBlack);
       Line.draw(imageData, new Point(15,15), new Point(15,5), Line.paintItBlack);
        for(let i = 5; i<=15; i++) {
            assert.notEqual(imageData.data[4*(5 + i*31) + 3], 0);
            assert.notEqual(imageData.data[4*(15 + i*31) + 3], 0);
        }
    });

});