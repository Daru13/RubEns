define(["require", "exports", "jquery", "./HTMLRenderer", "../Image/Layer"], function (require, exports, $, HTMLRenderer_1, Layer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a list of layers, with controls to modify it.
     *
     * It allows to add and remove layers, move them around, merge them, rename them,
     * hide/display them, and to change each layer blend mode.
     */
    class LayerList extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new, empty LayerList object.
         * The related Layer instance is the one of the current document of the given app instance.
         * @param  {JQuery}       parentNode Parent node owning current instance.
         * @param  {RubEns}       app        Related app instance (containing the layer manager).
         * @return {LayerManager}            Fresh instance of LayerManager.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "layers";
            /**
             * Event handler for history changes (undo, redo, new step saved).
             */
            this.layerChangeHandler = {
                eventTypes: ["rubens_addLayer", "rubens_deleteLayer", "rubens_selectLayer",
                    "rubens_moveLayer", "rubens_mergeLayers", "rubens_renameLayer",
                    "rubens_changeLayerBlendMode", "rubens_changeLayerVisibility"],
                callback: (_) => {
                    this.updateLayerListNode();
                    this.updateBlendModesMenuNode();
                }
            };
            /**
             * Event handler for document changes (created, closed).
             */
            this.documentChangedHandler = {
                eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
                callback: (_) => { this.updateRootNode(); }
            };
            /**
             * Event handler for layer (list elements) clicks.
             */
            this.layerClickHandler = {
                eventTypes: ["click"],
                selector: ".layer",
                callback: (event) => { this.onLayerClick(event); }
            };
            /**
             * Event handler for layer name input changes.
             */
            this.layerNameInputChangeHandler = {
                eventTypes: ["change", "focusout"],
                selector: ".layer_name_input",
                callback: (event) => { this.onLayerNameInputChange(event); }
            };
            /**
             * Event handler for menu button clicks.
             */
            this.menuButtonClickHandler = {
                eventTypes: ["click"],
                selector: "#layers_menu button",
                callback: (event) => { this.onMenuButtonClick(event); }
            };
            /**
             * Event handler for blend mode menu changes.
             */
            this.menuBlendModeChange = {
                eventTypes: ["change"],
                selector: "#layers_blend_modes_menu",
                callback: (event) => { this.onMenuBlendModeChange(event); }
            };
            this.createRootNode();
            this.app = app;
            this.layerManager = null;
            this.layerNameInputIsVisible = false;
            this.clickOnLayerNameRecentlyRecorded = false;
            this.registerEventHandlers();
            this.updateRootNode();
        }
        /**
         * Create the whole layer list.
         *
         * @author Camille Gobert
         */
        createRootNode() {
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
        updateRootNode() {
            super.updateRootNode();
            if (!this.app.document) {
                this.rootNode.addClass("empty");
            }
            else {
                this.rootNode.removeClass("empty");
            }
            this.updateLayerListNode();
            this.updateBlendModesMenuNode();
        }
        /**
         * Create the title node.
         *
         * @author Camille Gobert
         */
        createTitleNode() {
            let titleNode = $("<h3>");
            titleNode.html("Layers");
            this.rootNode.append(titleNode);
            this.titleNode = titleNode;
        }
        /**
         * Create the blend mode menu node.
         *
         * @author Camille Gobert
         */
        createBlendModeMenuNode() {
            let blendModesMenuNode = $("<select>");
            blendModesMenuNode.attr("id", "layers_blend_modes_menu");
            for (let blendingMode in Layer_1.BlendModes) {
                blendModesMenuNode.append($("<option>" + blendingMode + "</option>"));
            }
            this.menuNode.append(blendModesMenuNode);
        }
        /**
         * Update the blending mode menu node by selecting the right field.
         * If there is no document, nothing happens.
         *
         * @author Camille Gobert
         */
        updateBlendModesMenuNode() {
            if (!this.app.document) {
                return;
            }
            let selectedLayerBlendMode = this.layerManager.selectedLayer.blendMode;
            $("#layers_blend_modes_menu > option").prop("selected", false);
            $("#layers_blend_modes_menu > option:contains(" + selectedLayerBlendMode + ")").prop("selected", true);
        }
        /**
         * Create all the action buttons for the menu.
         *
         * @author Camille Gobert
         */
        createActionsButtons() {
            // Generically create, set up and append a button to the menu node
            let addMenuButton = (id, content) => {
                let buttonNode = $("<button>");
                buttonNode.attr("id", id);
                buttonNode.attr("type", "button");
                buttonNode.html(content);
                this.menuNode.append(buttonNode);
            };
            addMenuButton("layers_add_button", "+");
            addMenuButton("layers_remove_button", "−");
            addMenuButton("layers_move_up_button", "&uarr;");
            addMenuButton("layers_move_down_button", "&darr;");
            addMenuButton("layers_merge_button", "&DownArrowBar;");
        }
        /**
         * Create the menu node, and all the controls it contains.
         *
         * @author Camille Gobert
         */
        createMenuNode() {
            let menuNode = $("<div>");
            menuNode.attr("id", "layers_menu");
            this.menuNode = menuNode;
            this.rootNode.append(menuNode);
            // Create and append content to the menu
            this.createActionsButtons();
            this.createBlendModeMenuNode();
        }
        /**
         * Create the layer list node.
         *
         * @author Camille Gobert
         */
        createLayerListNode() {
            let layerListNode = $("<ol>");
            layerListNode.attr("id", "layer_list");
            // Add an empty element before the layer list, in order to stick the list to the bottom
            // This little hack seems required because of some flexbox issues with overflow-y (for scrolling)
            this.rootNode.append($("<div>")
                .attr("id", "layer_list_empty_space"));
            this.rootNode.append(layerListNode);
            this.layerListNode = layerListNode;
        }
        /**
         * Update the layer list node.
         * This list has no content if there is no current document.
         *
         * @author Camille Gobert
         */
        updateLayerListNode() {
            this.layerListNode.empty();
            this.layerNameInputIsVisible = false;
            if (!this.app.document) {
                return;
            }
            let layerManager = this.app.document.imageWorkspace.drawingLayers;
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
        getLayerAsListElement(layer) {
            let layerNode = $("<li>");
            layerNode.addClass("layer");
            // Layer identifier (in order to retrieve the right layer from the UI)
            layerNode.attr("data-layer-id", layer.id);
            // Append a visibility switch control
            let visibilitySwitchNode = $("<div>");
            visibilitySwitchNode.addClass("layer_visibility_switch");
            layerNode.append(visibilitySwitchNode);
            // Append the name of the layer
            let layerNameNode = $("<p>");
            layerNameNode.addClass("layer_name");
            layerNameNode.html(layer.name);
            layerNode.append(layerNameNode);
            // If required, mark the layer as selected
            if (layer === this.layerManager.selectedLayer) {
                layerNode.addClass("selected");
            }
            // If required, mark the layer as hidden
            if (layer.hidden) {
                layerNode.addClass("hidden");
            }
            return layerNode;
        }
        /**
         * Callback function called whenever a layer is clicked.
         * @param  {Event}  event The click event on the layer.
         *
         * @author Camille Gobert
         */
        onLayerClick(event) {
            let eventTarget = $(event.target);
            // Retrieve the layer identifier
            let layerId = parseInt(eventTarget.closest(".layer")
                .attr("data-layer-id"));
            // If a layer name input is displayed, there is nothing else do do here for now
            if (this.layerNameInputIsVisible) {
                return;
            }
            // Handle a potential double-click on the layer name
            if (eventTarget.closest(".layer_name").length > 0) {
                if (this.clickOnLayerNameRecentlyRecorded) {
                    this.clickOnLayerNameRecentlyRecorded = false;
                    this.onLayerNameDoubleClick(event);
                    return;
                }
                else {
                    this.clickOnLayerNameRecentlyRecorded = true;
                    setTimeout(() => {
                        this.clickOnLayerNameRecentlyRecorded = false;
                    }, 650);
                }
            }
            if (eventTarget.closest(".layer_visibility_switch").length > 0) {
                this.layerManager.switchLayerVisibility(layerId);
            }
            else {
                this.layerManager.selectLayer(layerId);
            }
        }
        /**
         * Callback function called whenever a layer name is double clicked.
         * @param  {Event}  event The event triggering the action.
         *
         * @author Camille Gobert
         */
        onLayerNameDoubleClick(event) {
            let eventTarget = $(event.target);
            // Replace the name by an input element, where it can be edited
            let nameInputNode = $("<input>");
            nameInputNode.attr("type", "text");
            nameInputNode.addClass("layer_name_input");
            nameInputNode.val(eventTarget.text());
            eventTarget.replaceWith(nameInputNode);
            this.layerNameInputIsVisible = true;
            // Immediately give the input focus, and select the text it containsI
            nameInputNode.focus()
                .select();
        }
        onLayerNameInputChange(event) {
            let eventTarget = $(event.target);
            // Retrieve the layer identifier
            let layerId = parseInt(eventTarget.closest(".layer")
                .attr("data-layer-id"));
            // Rename the layer, if it has not been done yet
            // This avoids double-renaming, which would save the action twice in the history
            let newName = eventTarget.val();
            let renamedLayerIndex = this.layerManager.getLayerIndexFromId(layerId);
            if (this.layerManager.layers[renamedLayerIndex].name != newName) {
                this.layerManager.renameLayer(layerId, newName);
            }
            else {
                this.updateLayerListNode();
            }
        }
        /**
         * Callback function called whenever a menu button is clicked.
         * @param  {Event} event The event triggering the action.
         *
         * @author Camille Gobert
         */
        onMenuButtonClick(event) {
            let eventTarget = $(event.target);
            // Layer addition
            if (eventTarget.closest("#layers_add_button").length === 1) {
                this.layerManager.createLayer();
            }
            else if (eventTarget.closest("#layers_remove_button").length === 1) {
                console.log("Attempt to del layer:" + this.layerManager.selectedLayer.id);
                this.layerManager.deleteSelectedLayer();
            }
            else if (eventTarget.closest("#layers_move_up_button").length === 1) {
                this.layerManager.moveSelectedLayerUp();
            }
            else if (eventTarget.closest("#layers_move_down_button").length === 1) {
                this.layerManager.moveSelectedLayerDown();
            }
            else if (eventTarget.closest("#layers_merge_button").length === 1) {
                this.layerManager.mergeSelectedLayerWithBelowLayer();
            }
        }
        /**
         * Callback function called whenever the blending mode menu changes.
         * @param  {Event} event The event triggering the action.
         *
         * @author Camille Gobert
         */
        onMenuBlendModeChange(event) {
            let eventTarget = $(event.target);
            let selectedModeValue = eventTarget.val();
            // This seems to be required in order to get the right type for newBlendMode
            // Otherwise, TypeScript refuses the string obtained from the selected menu option
            let newBlendMode = null;
            for (let blendMode in Layer_1.BlendModes) {
                if (blendMode == selectedModeValue) {
                    newBlendMode = blendMode;
                }
            }
            this.layerManager.changeSelectedLayerBlendMode(newBlendMode);
            console.log("Blend mode changed to " + newBlendMode);
        }
        /**
         * Register all events handlers to the event manager.
         *
         * @author Camille Gobert
         */
        registerEventHandlers() {
            this.app.eventManager.registerEventHandler(this.layerChangeHandler);
            this.app.eventManager.registerEventHandler(this.documentChangedHandler);
            this.app.eventManager.registerEventHandler(this.layerClickHandler);
            this.app.eventManager.registerEventHandler(this.layerNameInputChangeHandler);
            this.app.eventManager.registerEventHandler(this.menuButtonClickHandler);
            this.app.eventManager.registerEventHandler(this.menuBlendModeChange);
        }
        /**
         * Unregister all events handlers from the event manager.
         *
         * @author Camille Gobert
         */
        unregisterEventHandlers() {
            this.app.eventManager.unregisterEventHandler(this.layerChangeHandler);
            this.app.eventManager.unregisterEventHandler(this.documentChangedHandler);
            this.app.eventManager.unregisterEventHandler(this.layerClickHandler);
            this.app.eventManager.unregisterEventHandler(this.layerNameInputChangeHandler);
            this.app.eventManager.unregisterEventHandler(this.menuButtonClickHandler);
            this.app.eventManager.unregisterEventHandler(this.menuBlendModeChange);
        }
    }
    exports.LayerList = LayerList;
});
