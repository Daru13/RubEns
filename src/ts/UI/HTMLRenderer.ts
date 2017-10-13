import * as $ from "jquery";

export class HTMLRenderer {
    protected parentNode: JQuery;

    protected rootNode: JQuery;
    protected rootNodeType       = "div";
    protected rootNodeId         = "";
    protected rootNodeClasses    = "";
    protected rootNodeAttributes = {};

    constructor (parentNode: JQuery) {
        this.parentNode = parentNode;
    }

    createRootNode () {
        this.rootNode = $("<" + this.rootNodeType + ">");

        // Add optionnal id and class
        this.rootNode.attr("id", this.rootNodeId);
        this.rootNode.addClass(this.rootNodeClasses);

        // Add optionnal attributes
        for (let attribute in this.rootNodeAttributes) {
            let attributeValue = this.rootNodeAttributes[attribute];
            this.rootNode.attr(attribute, attributeValue);
        }

        this.parentNode.append(this.rootNode);
    }

    updateRootNode () {

    }

    removeRootNode () {
        this.rootNode.remove();
        this.rootNode = null;
    }
}
