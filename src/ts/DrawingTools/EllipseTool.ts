import { DrawingTool } from "./DrawingTool";
import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
import { Point } from "../utils/Point";
import { EventHandler } from "../UI/EventHandler";


/**
 * Tool used to draw ellipses.
 *
 * The user select two points, the first one being declared when the mouse button is clicked,
 * and the second one being declared when the mouse button is released.
 * The two points defines a rectangle, and the ellipse drawn is the circumscribed ellipse.
 */
export class EllipseTool extends DrawingTool {

    /**
     * The list of event handlers.
     */
    protected eventHandlers: EventHandler[];

    /**
     * The first point defining the rectangle
     */
    private first_point: Point;

    /**
     * The second point defining the rectangle
     */
    private second_point: Point;


    onMouseDown(event: MouseEvent) {
        let pointClicked = this.workingCanvas.getMouseEventCoordinates(event);

        if(this.first_point === null) {
            this.first_point = pointClicked;
        } else if(this.second_point === null) {
            this.second_point = pointClicked;
            this.apply(this.workingCanvas, null);
            this.first_point = null;
            this.second_point = null;
        }
    }

    /**
     * Basic constructor
     */
    constructor(workingCanvas: Canvas, previewCanvas: Canvas) {
        super(workingCanvas, previewCanvas);
        this.eventHandlers.push({
            eventTypes: ["mousedown"],
                selector: "canvas",
            callback: (event) => this.onMouseDown(<MouseEvent> event)

        });
        this.first_point = null;
        this.second_point = null;
    }


    /**
     * Apply the operation to the image
     *
     * @param {Canvas} image                    The image where the ellipse is drawn
     * @param {DrawingParameters} parameters    The parameters given by the user to draw the image
     *
     * @author Mathieu Fehr
     * // TODO add thickness support
     */
    apply(image: Canvas, parameters: DrawingParameters) {
        // Check if the rectangle is defined
        if(this.first_point === null || this.second_point === null) {
            return;
        }

        // Get the rectangle corners
        let min_x = Math.min(this.first_point.x, this.second_point.x);
        let min_y = Math.min(this.first_point.y, this.second_point.y);
        let max_x = Math.max(this.first_point.x, this.second_point.x);
        let max_y = Math.max(this.first_point.y, this.second_point.y);

        // The ellipse is defined as (x/a)^2 + (y/b)^2 = 1
        let a = (max_x - min_x)/2;
        let b = (max_y - min_y)/2;

        // The current image
        let imageData = image.getImageData();
        let imageDataWidth = imageData.width;

        // The color is currently random
        let color_r = Math.random() * 255;
        let color_g = Math.random() * 255;
        let color_b = Math.random() * 255;

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for(let i = min_x; i <= max_x; i++) {
            for(let j = min_y; j <= max_y; j++) {
                let x = (i-min_x-a);
                let y = (j-min_y-b);
                if((x/a)**2 + (y/b)**2 < 1) {
                    imageData.data[4 * (i + j * imageDataWidth)] = color_r;
                    imageData.data[4 * (i + j * imageDataWidth) + 1] = color_g;
                    imageData.data[4 * (i + j * imageDataWidth) + 2] = color_b;
                    imageData.data[4 * (i + j * imageDataWidth) + 3] = 255;
                }
            }
        }

        image.setImageData(imageData);
    }

}