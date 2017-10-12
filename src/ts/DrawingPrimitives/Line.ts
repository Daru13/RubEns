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

            let coordonee1D : number = (pixel.y*image.width+pixel.x)*4;
            image.data[coordonee1D] = color_r;
            image.data[coordonee1D + 1] = color_g;
            image.data[coordonee1D + 2] = color_b;
            image.data[coordonee1D + 3] = 255;
        }

        let currentPixel: Point = new Point(from.x, from.y);
        paintItBlack(currentPixel);
        let dx: number = to.x - from.x;
        let dy: number = to.y - from.y;
        let xinc: number = 0;
        let yinc: number = 0;

        // First we compute in which "direction" x and y increase
        // between from and to
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
        dx = Math.abs(dx);
        dy = Math.abs(dy);
        paintItBlack(from);
        if (Math.abs(dx) >= Math.abs(dy)) {
            let cumul: number = dx/2;
            for(let x = from.x; x != to.x; x += xinc ){
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
            for(let y = from.y; y != to.y; y += yinc){
                currentPixel.y += yinc;
                cumul += dx;
                if (cumul >= dy){
                    cumul -= dy;
                    currentPixel.x += xinc;
                }
                paintItBlack(currentPixel);
            }
        }
    }
}