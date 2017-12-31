import { HTMLRenderer } from "./HTMLRenderer";
import { ToolSelectionMenu } from "./ToolSelectionMenu";
import { RubEns } from "../RubEns";

/**
* Main UI element representing the tool menu of the UI.
*
* It is meant to display available tools, and allows the user to easily switch between them.
*/
export class ToolMenu extends HTMLRenderer {
    protected rootNodeId = "tool_menu";

    /**
     * Related app intance.
     */
    private app: RubEns;

    /**
     * Instance of the child tool selection menu.
     */
    toolSelectionMenu: ToolSelectionMenu;

    /**
     * Reference to the title node.
     */
    titleNode: JQuery;

    /**
     * Instanciates and initializes a new ToolMenu object, and set up the underlying tool selection menu.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {RubEns}   app        Related app instance.
     * @return {ToolMenu}            Fresh instance of ToolMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.app = app;

        this.createRootNode();

    }

    /**
     * Create the whole tool menu.
     *
     * @author Camille Gobert
     */
    createRootNode () {
        super.createRootNode();

        this.createTitleNode();
        this.createToolSelectionMenu();
    }

    /**
     * Create the tool selection menu.
     *
     * @author Camille Gobert
     */
    createToolSelectionMenu () {
        this.toolSelectionMenu = new ToolSelectionMenu(this.rootNode, this.app);
    }

    /**
     * Create the title node.
     *
     * @author Camille Gobert
     */
    private createTitleNode () {
        let titleNode = $("<h3>");
        titleNode.html("Tools");

        this.rootNode.append(titleNode);
        this.titleNode = titleNode;
    }
}
