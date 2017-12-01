import { Canvas } from "./Canvas";
import { Point } from "../utils/Point";
import { EventManager } from "../EventManager";

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
     * Event handler for document resized.
     */
    protected documentResizedHandler = {
        eventTypes: ["rubens_documentResized"],
        callback  : (event) => {
            let newWidth  = event.detail.newWidth;
            let newHeight = event.detail.newHeight;

            this.updateDimensions(newWidth, newHeight);
            this.updatePosition();
            this.updateBoundingRect();
        }
    };

    /**
     * Event handler for window resized.
     */
    private windowResizedHandler = {
        eventTypes: ["resize"],
        callback  : (_) => { this.updateBoundingRect(); }
    };



    /**
     * Creates a canvas that can be displayed on the web page, given a height, a width and an id.
     * The id allows the canvas to be fetched by the UI.
     *
     * @param {number} width                The width of the canvas.
     * @param {number} height               The height of the canvas.
     * @param {string} id                   The id of the canvas.
     * @param {EventManager} eventManager   The event manager.
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number, id: string, eventManager: EventManager) {
        super(width, height, eventManager);


        this.id = id;

        // Set the height and the width of the displayable object.
        let canvas = $(this.canvas);
        canvas.css("height", this.height + "px");
        canvas.css("width", this.width + "px");
        canvas.attr("id", this.id);

        eventManager.registerEventHandler(this.windowResizedHandler);

        this.updateCanvasNodeRelatedProperties();
    }


    /**
     * Create the HTML node related to this canvas, and update related properties.
     *
     * @author Camille Gobert
     */
    updateCanvasNodeRelatedProperties () {
        this.updateDimensions(this.width, this.height);
        this.updatePosition();
        this.updateBoundingRect();
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
     * Update the canvas dimensions.
     * It only updates the HTML and CSS dimensions.
     *
     * @param {number} width The new width.
     * @param {number} height The new height.
     *
     * @author Camille Gobert
     */
    updateDimensions(width: number, height: number) {
        super.updateDimensions(width, height);

        let canvas = $(this.canvas);

        // Set the CSS dimensions (via `style` attribute)
        let widthAsString  = width  + "px";
        let heightAsString = height + "px";

        canvas.css("width" , widthAsString);
        canvas.css("height", heightAsString);
    }

    /**
     * Update the canvas positions.
     *
     * @author Camille Gobert
     */
    updatePosition () {
        let canvas = $(this.canvas);

        let marginLeftAsString = (- Math.floor(this.width  / 2)) + "px";
        let marginTopAsString  = (- Math.floor(this.height / 2)) + "px";

        // Set the CSS negative margins (for proper centering)
        canvas.css("margin-left", marginLeftAsString);
        canvas.css("margin-top" , marginTopAsString);
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