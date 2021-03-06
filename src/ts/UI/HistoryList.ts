import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { RubEns } from "../RubEns";
import { History } from "../History";


/**
 * Constant meaning no maximum number of history steps to display.
 */
const UNLIMITED_HISTORY_STEPS = -1;


/**
 * UI element representing a History instance, as a list of history steps.
 *
 * It allows to navigate back and forth through the related history,
 * by displaying all the saved steps in a chronological order.
 */
export class HistoryList extends HTMLRenderer {
    protected rootNodeId = "history";

    /**
     * Related instance of RubEns app.
     */
    private app: RubEns;

    /**
     * Related instance of History.
     */
    private history: History;

    /**
     * Reference to the title node.
     */
    private titleNode: JQuery;

    /**
     * Reference to the step list node.
     */
    private stepListNode: JQuery;

    /**
     * Maximum number of history steps to display.
     */
    private maxNbStepsToDisplay: number;

    /**
     * Event handler for history changes (undo, redo, new step saved).
     */
    private historyChangeHandler = {
        eventTypes: ["rubens_undo", "rubens_redo", "rubens_historySaveStep"],
        callback: (_) => { this.updateStepListNode(); }
    };

    /**
     * Event handler for document changes (created, closed).
     */
    private documentChangedHandler = {
        eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
        callback: (_) => {
            if (this.app.document) {
                this.history = this.app.document.history;
            }
            else {
                this.history = null;
            }

            this.updateRootNode();
        }
    };

    /**
     * Event handler for history step (list elements) clicks.
     */
    private historyStepClickHandler = {
        eventTypes: ["click"],
        selector: ".history_step",
        callback: (event) => { this.onHistoryStepClick(event); }
    };

    /**
     * Instanciates and initializes a new, empty HistoryList object.
     * The related History instance is the one of the current document of the given app instance.
     * @param  {JQuery}      parentNode Parent node owning current instance.
     * @param  {RubEns}      app        Related app instance (containing the history).
     * @return {HistoryList}            Fresh instance of HistoryList.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.createRootNode();

        this.app     = app;
        this.history = null;

        // Display parameters
        this.maxNbStepsToDisplay = UNLIMITED_HISTORY_STEPS;

        this.registerEventHandlers();
        this.updateRootNode();
    }

    /**
     * Create the whole history list.
     *
     * @author Camille Gobert
     */
    createRootNode () {
        super.createRootNode();
        this.createTitleNode();
        this.createStepListNode();
    }


    /**
     * Update the whole history list.
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

        this.updateStepListNode();
    }


    /**
     * Create the title node.
     *
     * @author Camille Gobert
     */
    private createTitleNode () {
        let titleNode = $("<h3>");
        titleNode.html("History");

        this.rootNode.append(titleNode);
        this.titleNode = titleNode;
    }


    /**
     * Create the list of history step list node.
     *
     * @author Camille Gobert
     */
    private createStepListNode () {
        let stepListNode = $("<ol>");
        stepListNode.addClass("history_list");

        this.rootNode.append(stepListNode);
        this.stepListNode = stepListNode;
    }


    /**
     * Update the history step list node.
     * This list has no content if there is no current document.
     *
     * @author Camille Gobert
     */
    private updateStepListNode () {
        this.stepListNode.empty();

        if (! this.app.document) {
            return;
        }

        for (let step = this.history.firstAvailableStep; step < this.history.latestAvailableStep; step++) {
            let stepAsListElement = this.getHistoryStepAsListElement(step);
            this.stepListNode.append(stepAsListElement);
        }
    }


    /**
     * Create and return a list element representing the given history step.
     * @param  {number} step History step to transform into a list element.
     * @return {JQuery}      List element representing the given step.
     *
     * @author Camille Gobert
     */
    private getHistoryStepAsListElement (step: number) {
        let currentStep = this.history.currentStep;

        let stepNode = $("<li>");
        stepNode.addClass("history_step");
        stepNode.html(this.history.listOfActions[step].description);

        // Step (in order to retrieve the right one from the UI)
        stepNode.attr("data-history-step", step);

        // If required, mark the step as canceled
        if (step > currentStep) {
            stepNode.addClass("canceled");
        }

        // If required, mark the step as current
        if (step === currentStep) {
            stepNode.addClass("current");
        }

        return stepNode;
    }


    private onHistoryStepClick (event: Event) {
        // Retrieve the history step
        let historyStep = parseInt($(event.target).closest(".history_step")
                                                    .attr("data-history-step"));

        // console.log("History step clicked: " + historyStep + ")");
        this.history.goToStep(historyStep);
    }


    /**
     * Register all events handlers to the event manager.
     *
     * @author Camille Gobert
     */
    private registerEventHandlers () {
        this.app.eventManager.registerEventHandler(this.historyChangeHandler);
        this.app.eventManager.registerEventHandler(this.documentChangedHandler);
        this.app.eventManager.registerEventHandler(this.historyStepClickHandler);
    }


    /**
     * Unregister all events handlers from the event manager.
     *
     * @author Camille Gobert
     */
    private unregisterEventHandlers () {
        this.app.eventManager.unregisterEventHandler(this.historyChangeHandler);
        this.app.eventManager.unregisterEventHandler(this.documentChangedHandler);
        this.app.eventManager.unregisterEventHandler(this.historyStepClickHandler);
    }
}
