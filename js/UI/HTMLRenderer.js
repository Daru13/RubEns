define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Abstract generic UI element which can be rendered as an HTML node.
     *
     * It contains several properties about the HTML node, and methods to manage it.
     * This class should be extended by any UI element meant to be rendered as HTML,
     * which should, in turn, specialize the behaviour of this generic renderer to meet its needs.
     */
    class HTMLRenderer {
        /**
         * Instanciates and initialize a new HTMLRenderer object.
         * @param  {JQuery}       parentNode Parent node owning current instance.
         * @return {HTMLRenderer}            Fresh instance of HTMLRenderer.
         *
         * @author Camille Gobert
         */
        constructor(parentNode) {
            /**
             * Type of HTML node of the root node to create.
             */
            this.rootNodeType = "div";
            /**
             * Object of additional attributes to add to the root node.
             * An additional attribute must be a 'key: value' couple,
             * where the key is the attribute and the value is the attribute value.
             *
             * If empty, no additional attribute is added to the root node.
             */
            this.rootNodeAttributes = {};
            this.parentNode = parentNode;
        }
        /**
         * Create and append the root node to the parent node.
         * @param {boolean} appendToParent If `true`, append the root node to its parent
         *                                 immediately after being created and initialized (default).
         *
         * @author Camille Gobert
         */
        createRootNode(appendToParent = true) {
            this.rootNode = $("<" + this.rootNodeType + ">");
            // Add optionnal id and class
            if (this.rootNodeId) {
                this.rootNode.attr("id", this.rootNodeId);
            }
            if (this.rootNodeClasses) {
                this.rootNode.addClass(this.rootNodeClasses);
            }
            // Add optionnal attributes
            for (let attribute in this.rootNodeAttributes) {
                let attributeValue = this.rootNodeAttributes[attribute];
                this.rootNode.attr(attribute, attributeValue);
            }
            if (appendToParent) {
                this.parentNode.append(this.rootNode);
            }
        }
        /**
         * Update the root node.
         * This method currently has no implementation in this class.
         *
         * @author Camille Gobert
         */
        updateRootNode() {
        }
        /**
         * Remove the root node from the parent node.
         *
         * @author Camille Gobert
         */
        removeRootNode() {
            this.rootNode.remove();
            this.rootNode = null;
        }
    }
    exports.HTMLRenderer = HTMLRenderer;
});
