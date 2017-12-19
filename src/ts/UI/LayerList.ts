import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { RubEns } from "../RubEns";
import { Layer } from "../Image/Layer";
import { LayerManager } from "../Image/LayerManager";


/**
 * UI element representing a History instance, as a list of history steps.
 *
 * It allows to navigate back and forth through the related history,
 * by displaying all the saved steps in a chronological order.
 */
export class LayerList extends HTMLRenderer {
    protected rootNodeId = "layers";

    /**
     * Related instance of RubEns app.
     */
    private app: RubEns;

    /**
     * Related instance of History.
     */
    private layerManager: LayerManager;

    /**
     * Reference to the title node.
     */
    private titleNode: JQuery;

    /**
     * Reference to the layer list node.
     */
    private layerListNode: JQuery;

    /**
     * Reference to the menu node.
     */
    private menuNode: JQuery;

    /**
     * Event handler for history changes (undo, redo, new step saved).
     */
    private layerChangeHandler = {
        eventTypes: ["rubens_addLayer", "rubens_deleteLayer", "rubens_selectLayer"],
        callback: (_) => {
            this.updateLayerListNode();
            this.updateBlendingModesMenuNode();
        }
    };

    /**
     * Event handler for document changes (created, closed).
     */
    private documentChangedHandler = {
        eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
        callback: (_) => { this.updateRootNode(); }
    };

    /**
     * Event handler for layer (list elements) clicks.
     */
    private layerClickHandler = {
        eventTypes: ["click"],
        selector: ".layer",
        callback: (event) => { this.onLayerClick(event); }
    };

    /**
     * Event handler for menu actions.
     */
     private menuActionHandler = {
        eventTypes: ["click", "change"],
        selector: "#layers_menu",
        callback: (event) => { this.onMenuAction(event); }
    };

    /**
     * Instanciates and initializes a new, empty LayerList object.
     * The related Layer instance is the one of the current document of the given app instance.
     * @param  {JQuery}       parentNode Parent node owning current instance.
     * @param  {RubEns}       app        Related app instance (containing the layer manager).
     * @return {LayerManager}            Fresh instance of LayerManager.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.createRootNode();

        this.app          = app;
        this.layerManager = null;

        this.registerEventHandlers();
        this.updateRootNode();
    }

    /**
     * Create the whole layer list.
     *
     * @author Camille Gobert
     */
    createRootNode () {
        super.createRootNode();
        this.createTitleNode();
        this.createMenuNode();
        this.createLayerListNode();
    }


    /**
     * Update the whole layer list.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        super.updateRootNode();

        if (! this.app.document) {
            this.rootNode.addClass("empty");
        }
        else {
            this.rootNode.removeClass("empty");
        }

        this.updateLayerListNode();
        this.updateBlendingModesMenuNode();
    }


    /**
     * Create the title node.
     *
     * @author Camille Gobert
     */
    private createTitleNode () {
        let titleNode = $("<h3>");
        titleNode.html("Layers");

        this.rootNode.append(titleNode);
        this.titleNode = titleNode;
    }


    /**
     * Create the blending mode menu node, and initally updates it.
     *
     * @author Camille Gobert
     */
    private createBlendingModeMenuNode () {
        let blendingModesMenuNode = $("<select>");
        blendingModesMenuNode.attr("id", "layers_blending_modes_menu");

        // Set up the available blending modes
        let availableBlendingModes = [
            "Normal",
            "Add",
            "Substract",
            "(Dummy mode)"
        ];

        for (let blendingMode of availableBlendingModes) {
            blendingModesMenuNode.append($("<option>" + blendingMode + "</option>"));
        }

        this.menuNode.append(blendingModesMenuNode);
        this.updateBlendingModesMenuNode();
    }


    /**
     * Update the blending mode menu node by selecting the right field.
     *
     * @author Camille Gobert
     */
    private updateBlendingModesMenuNode () {
        // TODO
    }


    /**
     * Create the menu node, and all the controls it contains.
     *
     * @author Camille Gobert
     */
    private createMenuNode () {
        let menuNode = $("<div>");
        menuNode.attr("id", "layers_menu");

        // Button to add a new layer
        let addLayerButtonNode = $("<button>");
        addLayerButtonNode.attr("id", "layers_add_button");
        addLayerButtonNode.attr("type", "button");
        addLayerButtonNode.html("+");

        menuNode.append(addLayerButtonNode);

        // Button to remove the selected layer
        let removeLayerButtonNode = $("<button>");
        removeLayerButtonNode.attr("id", "layers_remove_button");
        removeLayerButtonNode.attr("type", "button");
        removeLayerButtonNode.html("−");

        menuNode.append(removeLayerButtonNode);

        this.menuNode = menuNode;
        this.rootNode.append(menuNode);

        this.createBlendingModeMenuNode();
    }


    /**
     * Create the layer list node.
     *
     * @author Camille Gobert
     */
    private createLayerListNode () {
        let layerListNode = $("<ol>");
        layerListNode.attr("id", "layer_list");

        // Add an empty element before the layer list, in order to stick the list to the bottom
        // This little hack is kinda required before of some flexbox issues with overflow-y (for scrolling)
        this.rootNode.append($("<div>").css("flex-grow", 1));

        this.rootNode.append(layerListNode);
        this.layerListNode = layerListNode;
    }


    /**
     * Update the layer list node.
     * This list has no content if there is no current document.
     *
     * @author Camille Gobert
     */
    private updateLayerListNode () {
        this.layerListNode.empty();

        if (! this.app.document) {
            return;
        }

        let layerManager  = this.app.document.imageWorkspace.drawingLayers;
        this.layerManager = layerManager;

        // Layers are listed in reverse order, so the bottom one is at the end of the HTML list
        //for (let i = layerManager.layers.length - 1; i >= 0; i--) {
        for (let layer of layerManager.layers) {
            //let layer = layerManager.layers[i];

            let layerAsListElement = this.getLayerAsListElement(layer);
            this.layerListNode.append(layerAsListElement);
        }
    }


    /**
     * Create and return a list element representing the given layer.
     * @param  {Layer}  layer Layer to transform into a list element.
     * @return {JQuery}       List element representing the given layer.
     *
     * @author Camille Gobert
     */
    private getLayerAsListElement (layer: Layer) {
        let layerNode = $("<li>");
        layerNode.html(layer.name);
        layerNode.addClass("layer");

        // Layer identifier (in order to retrieve the right layer from the UI)
        layerNode.attr("data-layer-id", layer.id);

        // If required, mark the layer as selected
        if (layer === this.layerManager.selectedLayer) {
            layerNode.addClass("selected");
        }

        return layerNode;
    }


    /**
     * Callback function called whenever a layer is clicked.
     * @param  {Event}  event The click event on the layer.
     *
     * @author Camille Gobert
     */
    private onLayerClick (event: Event) {
        // Retrieve the layer identifier
        let layerId = $(event.target).closest(".layer")
                                     .attr("data-layer-id");

        this.layerManager.selectLayer(parseInt(layerId));
        console.log("Layer clicked (id:" + layerId + ")");
    }


    /**
     * Callback function called whenever an action occurs on the menu (see [[menuActionHandler]]).
     * @param  {Event} event The event triggering the action.
     *
     * @author Camille Gobert
     */
    private onMenuAction (event) {
        let eventType   = event.type;
        let eventTarget = $(event.target);

        // Blending mode update
        if (eventType === "change"
        &&  eventTarget.closest("#layers_blending_modes_menu").length === 1) {
            let newBlendingMode = eventTarget.val();

            // TODO: change the blending mode of currently selected layer
            console.log("Blending mode selected (val: " + newBlendingMode + ")");
        }

        // Layer addition
        else if (eventType === "click"
             &&  eventTarget.closest("#layers_add_button").length === 1) {
            this.layerManager.createLayer();
        }

        // Layer removal
        else if (eventType === "click"
             &&  eventTarget.closest("#layers_remove_button").length === 1) {
            console.log("Attempt to del layer:" + this.layerManager.selectedLayer.id);
            this.layerManager.deleteLayer(this.layerManager.selectedLayer.id);
        }
    }


    /**
     * Register all events handlers to the event manager.
     *
     * @author Camille Gobert
     */
    private registerEventHandlers () {
        this.app.eventManager.registerEventHandler(this.layerChangeHandler);
        this.app.eventManager.registerEventHandler(this.documentChangedHandler);
        this.app.eventManager.registerEventHandler(this.layerClickHandler);
        this.app.eventManager.registerEventHandler(this.menuActionHandler);
    }


    /**
     * Unregister all events handlers from the event manager.
     *
     * @author Camille Gobert
     */
    private unregisterEventHandlers () {
        this.app.eventManager.unregisterEventHandler(this.layerChangeHandler);
        this.app.eventManager.unregisterEventHandler(this.documentChangedHandler);
        this.app.eventManager.unregisterEventHandler(this.layerClickHandler);
        this.app.eventManager.unregisterEventHandler(this.menuActionHandler);
    }
}
