import { HTMLRenderer } from "./HTMLRenderer";

/**
 * Main UI element representing the bottom status bar of the GUI.
 *
 * It is meant to contain various information about the current document/workspace.
 * It should be updated in order to always display fresh and relevant information to the user.
 */
export class StatusBar extends HTMLRenderer {
    protected rootNodeId = "status_bar";

    /**
     * Instanciates and initializes a new, empty StatusBar object.
     * @param  {JQuery} parentNode Parent node owning current instance.
     * @return {StatusBar}         Fresh instance of StatusBar.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    updateRootNode () {
        this.rootNode.html(this.rootNodeId);
    }
}
