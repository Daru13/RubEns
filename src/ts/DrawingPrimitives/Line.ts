import { Point } from "../utils/Point";
import {Color} from "../utils/Color";

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
     */
    /*static paintItBlack(pixel: Point, image: ImageData, alpha: number):void {
         if(pixel.x < 0 || pixel.x > image.width-1 || pixel.y < 0 || pixel.y > image.height-1) {
             return;
         }
         // The color is currently random
         let color_r = 0;
         let color_g = 0;
         let color_b = 0;

         let coordonee1D = (pixel.y*image.width+pixel.x)*4;
         image.data[coordonee1D] = color_r;
         image.data[coordonee1D + 1] = color_g;
         image.data[coordonee1D + 2] = color_b;
         image.data[coordonee1D + 3] = Math.floor(alpha);
     }*/


    /**
     * This function draw a line between the pixel from and to.
     * It implements the algorithm of Bresenham
     * (cf. [[https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm]])
     * @param  {ImageData} image the image where the line is drawn
     * @param  {Point}     from  the starting point
     * @param  {Point}     to    the ending point
     * @param  {toDraw}    brush the function to apply
     *
     * @author Josselin GIET
     *
     */
    /*static draw(image: ImageData, from: Point, to: Point, brush: Brush) {
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

     //  Line.bresenham(image,from,to,10)
    }*/

    /*static bresenham(image: ImageData,from: Point, to: Point, thickness: number){
        function setPixelColor(x,y,transparency){
            let currentPixel: Point = new Point(x, y);
            Line.paintItBlack(currentPixel,image,Math.floor(transparency));
        }

        // brush(currentPixel, image);
        // First we compute in which "direction" x and y increase
        // between from and to
        let x0 = from.x;
        let x1 = to.x;
        let y0 = from.y;
        let y1 = to.y;
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        let sx = dx > 0 ? 1 : -1;
        let sy = dy > 0 ? 1 : -1;

        dx = Math.abs(dx);
        dy = Math.abs(dy);
        let err = dx -dy;
        let ed = dx + dy == 0? 0 : Math.sqrt(dx*dx+dy*dy);
        let e2 = 0;
        let x2 = 0;
        let y2 = 0;


        let cont: boolean = true;
        let wd = Math.floor((thickness+1)/2);
        // Since there is no "break" instruction in Typescript
        while (cont ){
            setPixelColor(x0, y0, Math.max(0,255*(Math.abs(err-dx+dy)/ed - wd + 1)));
            e2 = err;
            x2 = x0;
            if(2*e2 >= -dx) {
                e2 += dy;
                y2 = y0;
                while(e2 < ed*wd &&  dx > dy) {
                    y2 += sy;
                    setPixelColor(x0, y2, Math.max(0, 255*(Math.abs(e2)/ed - wd + 1)));
                    e2 += dx;
                }
                if (x0 == x1){ cont = false}
                e2 = err;
                err -= dy;
                x0 += sx;
            }
            if (2*e2 <= dy) {
                e2 = dx-e2;
                while (e2 < ed*wd && dx < dy ){
                    x2 += sx;
                    setPixelColor(x2, y0, Math.max(0,255*(Math.abs(e2)/ed-wd+1)));
                    e2 += dy;
                }
                if (y0 == y1){ cont = false}
                err += dx;
                y0 += sy;
            }
        }
    }*/


    static draw(image: ImageData, from: Point, to: Point, thickness: number, color: Color) {
        if(from === to) {
            return;
        }

        let imageWidth = image.width;
        let imageHeight = image.height;

        let minX = Math.min(from.x, to.x);
        let maxX = Math.max(from.x, to.x);
        let minY = Math.min(from.y, to.y);
        let maxY = Math.max(from.y, to.y);

        let drawingMinX = Math.ceil(Math.max(0, minX - thickness));
        let drawingMaxX = Math.floor(Math.min(imageWidth - 1, maxX + thickness));
        let drawingMinY = Math.ceil(Math.max(0, minY - thickness));
        let drawingMaxY = Math.floor(Math.min(imageHeight - 1, maxY + thickness));

        for(let x = drawingMinX; x <= drawingMaxX; x++) {
            for(let y = Math.floor(drawingMinY); y <= Math.ceil(drawingMaxY); y++) {
                let distanceToLine = Math.sqrt(Line.distanceToLineSquared(from, to, new Point(x,y)));
                let offset = (y * imageWidth + x) * 4;

                if( distanceToLine < thickness - Math.sqrt(2)) {
                    let red = image.data[offset];
                    let blue = image.data[offset + 1];
                    let green = image.data[offset + 2];
                    let alpha = image.data[offset + 3];
                    let outColor = Color.blend(color, new Color(red, blue, green, alpha));
                    image.data[offset] = outColor.red;
                    image.data[offset + 1] = outColor.blue;
                    image.data[offset + 2] = outColor.green;
                    image.data[offset + 3] = outColor.alpha;
                } else if(distanceToLine < thickness + Math.sqrt(2)) {
                    let nbPointsInEllipse = 0;
                    for(let dx = -4; dx<=4; dx++) {
                        for(let dy = -4; dy<=4; dy++) {
                            let distanceToLineSquared = Line.distanceToLineSquared(from, to, new Point(x + dx/4, y + dy/4));
                            if(distanceToLineSquared < thickness**2) {
                                nbPointsInEllipse += 1;
                            }
                        }
                    }
                    let newAlpha = (nbPointsInEllipse / 81) * color.alpha;
                    if(thickness <= 1) {
                        newAlpha = Math.min(255,2*newAlpha);
                    }
                    let red = image.data[offset];
                    let blue = image.data[offset + 1];
                    let green = image.data[offset + 2];
                    let alpha = image.data[offset + 3];
                    let outColor = Color.blend(new Color(color.red, color.blue, color.green, newAlpha),
                                               new Color(red, blue, green, alpha));
                    image.data[offset] = outColor.red;
                    image.data[offset + 1] = outColor.blue;
                    image.data[offset + 2] = outColor.green;
                    image.data[offset + 3] = outColor.alpha;
                }
            }
        }
    }

    static distanceToLineSquared(from: Point, to: Point, point: Point): number {
        let lengthSquared = from.distanceTo2(to);
        if(lengthSquared === 0) {
            return from.distanceTo2(point);
        }

        let t = ((point.x - from.x) * (to.x - from.x) + (point.y - from.y) * (to.y - from.y)) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        let projectionPoint: Point = new Point(from.x + t * (to.x - from.x),
                                               from.y + t * (to.y - from.y));
        return point.distanceTo2(projectionPoint);
    }
}
