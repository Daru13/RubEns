import { Canvas } from "./Canvas";
import { Point } from "../utils/Point";

/**
 * Represent a HTML5 canvas that is drawn in the web page.
 */
export class DisplayableCanvas extends Canvas {

    /**
     * The canvas id
     */
    id: string;

    /**
     * The bounding rectangle of the canvas.
     */
    private canvasBoundingRect: ClientRect;


    /**
     * Creates a canvas that can be displayed on the web page, given a height, a width and an id.
     * The id allows the canvas to be fetched by the UI.
     *
     * @param {number} width    The width of the canvas.
     * @param {number} height   The height of the canvas.
     * @param {string} id       The id of the canvas
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number, id: string) {
        super(width, height);

        this.id = id;

        // Set the height and the width of the displayable object.
        let canvas = $(this.canvas);
        canvas.css("height", height + "px");
        canvas.css("width", width + "px");
        canvas.attr("id", id);

        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
    }


    /**
     * Compute and save the bounding rectangle of the HTML canvas.
     * This method should be called whenever the canvas changes in the DOM.
     *
     * @author Camille Gobert
     */
    updateBoundingRect () {
        this.canvasBoundingRect = this.canvas.getBoundingClientRect();
    }


    /**
     * Get the position of a mouse event relative to the canvas,
     * @param  {MouseEvent} event The mouse event
     * @return                    The position of the mouse event relative to the canvas.
     *
     * @author Camille Gobert
     */
    getMouseEventCoordinates (event: MouseEvent) {
        let boundingRect = this.canvasBoundingRect;

        let mouseX = (event.clientX - boundingRect.left);
        let mouseY = (event.clientY - boundingRect.top);

        let coordinates = new Point(mouseX, mouseY);

        coordinates.x *= (boundingRect.right  - boundingRect.left) / this.canvas.width;
        coordinates.y *= (boundingRect.bottom - boundingRect.top)  / this.canvas.height;

        return coordinates;
    }
}