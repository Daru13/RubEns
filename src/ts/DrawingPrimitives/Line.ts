import { Point } from "../utils/Point";

/**
 * Type of the brush
 *
 *  @author Josselin GIET
 *
 */
type Brush = (center: Point, image: ImageData) => void



/**
 * Drawing primitives for lines
 */
export class Line {



    /**
     * A Drawing primitive that plots in black a pixel on the canas
     *
     * @author Josselin GIET
     *
     * @param  {Point}     pixel the pixel to plot
     * @param  {ImageData} image the ImageData to modify
     * @return {void}            Returns nothing : works by side-effect
     */
    static paintItBlack(pixel: Point, image: ImageData):void {
         if(pixel.x < 0 || pixel.x > image.width-1 || pixel.y < 0 || pixel.y > image.height-1) {
             return;
         }
         // The color is currently random
         let color_r = 0; //Math.random() * 255;
         let color_g = 0; //Math.random() * 255;
         let color_b = 0; //Math.random() * 255;

         let coordonee1D = (pixel.y*image.width+pixel.x)*4;
         image.data[coordonee1D] = color_r;
         image.data[coordonee1D + 1] = color_g;
         image.data[coordonee1D + 2] = color_b;
         image.data[coordonee1D + 3] = 255;
     }


    /**
     * This function draw a line between the pixel from and to.
     * It implements the algorithm of Bresenham
     * (cf. [[https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm]])
     * @param  {ImageData} image the image where the line is drawn
     * @param  {Point}     from  the starting point
     * @param  {Point}     to    the ending point
     * @param  {toDraw}    brush the function to apply
     * @return {void}            returns nothing : works by side-effect
     *
     * @author Josselin GIET
     *
     */
    static draw(image: ImageData, from: Point, to: Point, brush: Brush) {



        let currentPixel: Point = new Point(from.x, from.y);
        brush(currentPixel, image);
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        let xInc = 0;
        let yInc = 0;

        // First we compute in which "direction" x and y increase
        // between from and to
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
        dx = Math.abs(dx);
        dy = Math.abs(dy);

        if (Math.abs(dx) >= Math.abs(dy)) {
            let cumul = dx/2;
            for(let x = from.x; x != to.x; x += xInc ){
                currentPixel.x += xInc;
                cumul += dy;
                if ( cumul >= dx ){
                    cumul -= dx;
                    currentPixel.y += yInc;
                }
                brush(currentPixel, image);
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
                brush(currentPixel, image);
            }
        }
    }
}
