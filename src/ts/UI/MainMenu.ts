import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ToolSelectionMenu } from "./ToolSelectionMenu";
import { Document } from "../Document";

/**
 * UI element representing a single numerical parameter.
 */
export class MainMenu extends HTMLRenderer {
    protected rootNodeId = "main_menu";

    /**
     * Instance of the child tool selection menu.
     */
    toolSelectionMenu: ToolSelectionMenu;

    /**
     * Instanciates and initializes a new MainMenu object and its sub-modules.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {Document} document   Related document instance.
     * @return {MainMenu}            Fresh instance of MainMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.toolSelectionMenu = new ToolSelectionMenu(this.rootNode, document);
    }
}
