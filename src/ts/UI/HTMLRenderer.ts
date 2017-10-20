import * as $ from "jquery";

/**
 * Abstract generic UI element which can be rendered as an HTML node.
 *
 * It contains several properties about the HTML node, and methods to manage it.
 * This class should be extended by any UI element meant to be rendered as HTML,
 * which should, in turn, specialize the behaviour of this generic renderer to meet its needs.
 */
export abstract class HTMLRenderer {
    /**
     * Parent node of this renderer root node.
     */
    protected parentNode: JQuery;

    /**
     * Root node of this renderer.
     * All child nodes managed by this class must belong to this root node.
     */
    protected rootNode: JQuery;

    /**
     * Type of HTML node of the root node to create.
     */
    protected rootNodeType = "div";

    /**
     * Value of the `id` attribute of the root node.
     *
     * If undefined, no `id` attribute is added to the root node.
     */
    protected rootNodeId: string;

    /**
     * Value of the `class` attribute of the root node.
     * Note that one node can have several classes, separated by space character(s).
     *
     * If undefined, no `class` attribute is added to the root node.
     */
    protected rootNodeClasses: string;

    /**
     * Object of additional attributes to add to the root node.
     * An additional attribute must be a 'key: value' couple,
     * where the key is the attribute and the value is the attribute value.
     *
     * If empty, no additional attribute is added to the root node.
     */
    protected rootNodeAttributes = {};

    /**
     * Instanciates and initialize a new HTMLRenderer object.
     * @param  {JQuery}       parentNode Parent node owning current instance.
     * @return {HTMLRenderer}            Fresh instance of HTMLRenderer.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery) {
        this.parentNode = parentNode;
    }

    /**
     * Create and append the root node to the parent node.
     *
     * @author Camille Gobert
     */
    createRootNode () {
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

        this.parentNode.append(this.rootNode);
    }

    /**
     * Update the root node.
     * This method currently has no implementation in this class.
     *
     * @author Camille Gobert
     */
    updateRootNode () {

    }

    /**
     * Remove the root node from the parent node.
     *
     * @author Camille Gobert
     */
    removeRootNode () {
        this.rootNode.remove();
        this.rootNode = null;
    }
}
