import { Point } from "../utils/Point";

/**
 * Drawing primitives for lines
 */
export class Line {

    /**
     * This function draw a line between the pixel from and to.
     * It implements the algorithm of Bresenham
     * (cf. [[https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm]])
     *
     * @param image         the image where the line is drawn
     * @param from          the starting point
     * @param to            the ending point
     * @param thickness     the thickness of the line
     *
     * @author Josselin GIET
     */
    static draw(image: ImageData, from: Point, to: Point, thickness: number) {

        function paintItBlack(pixel: Point) {
            if(pixel.x < 0 || pixel.x > image.width-1 || pixel.y < 0 || pixel.y > image.height-1) {
                return;
            }

            // The color is currently random
            let color_r = 0; //Math.random() * 255;
            let color_g = 0; //Math.random() * 255;
            let color_b = 0; //Math.random() * 255;

            let coordinate1D = (pixel.y*image.width+pixel.x)*4;
            image.data[coordinate1D] = color_r;
            image.data[coordinate1D + 1] = color_g;
            image.data[coordinate1D + 2] = color_b;
            image.data[coordinate1D + 3] = 255;
        }

        let currentPixel = new Point(from.x, from.y);
        paintItBlack(currentPixel);
        let dx = Math.abs(to.x - from.x);
        let dy = Math.abs(to.y - from.y);

        // First we compute in which "direction" x and y increase
        // between from and to
        let xInc, yInc;

        if (dx > 0){
            xInc = 1;
        }
        else{
            xInc = -1;
        }
        if (dy > 0){
            yInc = 1;
        }
        else{
            yInc = -1;
        }


        if (Math.abs(dx) >= Math.abs(dy)) {
            let cumul = dx/2;
            for(let x = from.x; x != to.x; x += xInc){
                currentPixel.x += xInc;
                cumul += dy;
                if ( cumul >= dx ){
                    cumul -= dx;
                    currentPixel.y += yInc;
                }
                paintItBlack(currentPixel);
            }
        }
        else{
            let cumul = dy/2;
            for(let y = from.y; y != to.y; y += yInc){
                currentPixel.y += yInc;
                cumul += dx;
                if (cumul >= dy){
                    cumul -= dy;
                    currentPixel.x += xInc;
                }
                paintItBlack(currentPixel);
            }
        }
    }
}