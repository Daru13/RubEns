import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
import { DrawingTool } from "./DrawingTool"

/**
 * @author : Josselin GIET
 *
 * this is a generic type for pixel
 *
 * @param x  from left to right & y from top to bottom, both from 0 to n-1
 * to acced this pixel you need to ask :
 * r : (y*width + x)*4
 * g : (y*width + x)*4 + 1
 * b : (y*width + x)*4 + 2
 * a : (y*width + x)*4 + 3
*/
type Point = {
    x: number,
    y: number
};

export class DrawLine implements DrawingTool {

    // this  function draws a line

    apply (image: Canvas, parameters: DrawingTool){

    }

    draw (imageData: ImageData, from: Point, to: Point, thickness: number ){
        // This function paint a pixel in black (by side-effect)
        let paintItBlack = function (pixel: Point) {
            let coordonee1D : number = (pixel.y*imageData.width)*4 + pixel.x
            imageData.data[coordonee1D] = 0;
            imageData.data[coordonee1D + 1] = 0;
            imageData.data[coordonee1D + 2] = 0;
            imageData.data[coordonee1D + 2] = 0;
        }

        let currentPixel: Point = from;
        paintItBlack(currentPixel);
        if (Math.abs(from.x-to.x)<Math.abs(from.y-to.y)){
            let dx: number = to.x - from.x;
            let dy: number = to.y - from.y;
            let xinc: number = 0;
            let yinc: number = 0;
            if (dx > 0){
                xinc = 1;
            }
            else{
                xinc = -1;
            }
            if (dy > 0){
                yinc = 1;
            }
            else{
                yinc = -1;
            }
            paintItBlack(from);
            if (dx > dy) {
                let cumul: number = dx/2
                for(let x = from.x; x < to.x; x += xinc ){
                    currentPixel.x += xinc;
                    cumul += dy;
                    if ( cumul >= dx ){
                        cumul -= dx;
                        currentPixel.y += yinc;
                    }
                    paintItBlack(currentPixel);
                }
            }
            else{
                let cumul: number = dy/2;
                for(let y = from.y; y < to.y; y += yinc){
                    currentPixel.y += yinc;
                    cumul += dx;
                    if (cumul >= dy){
                        cumul -= dy;
                        currentPixel.x += xinc;
                    }
                    paintItBlack(currentPixel)
                }
            }
        }
    }
}
