define(["require", "exports", "jquery", "./HTMLRenderer"], function (require, exports, $, HTMLRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    class HistoryList extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new, empty HistoryList object.
         * The related History instance is the one of the current document of the given app instance.
         * @param  {JQuery}      parentNode Parent node owning current instance.
         * @param  {RubEns}      app        Related app instance (containing the history).
         * @return {HistoryList}            Fresh instance of HistoryList.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "history";
            /**
             * Event handler for history changes (undo, redo, new step saved).
             */
            this.historyChangeHandler = {
                eventTypes: ["rubens_undo", "rubens_redo", "rubens_historySaveStep"],
                callback: (_) => { this.updateStepListNode(); }
            };
            /**
             * Event handler for document changes (created, closed).
             */
            this.documentChangedHandler = {
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
            this.historyStepClickHandler = {
                eventTypes: ["click"],
                selector: ".history_step",
                callback: (event) => { this.onHistoryStepClick(event); }
            };
            this.createRootNode();
            this.app = app;
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
        createRootNode() {
            super.createRootNode();
            this.createTitleNode();
            this.createStepListNode();
        }
        /**
         * Update the whole history list.
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
            this.updateStepListNode();
        }
        /**
         * Create the title node.
         *
         * @author Camille Gobert
         */
        createTitleNode() {
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
        createStepListNode() {
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
        updateStepListNode() {
            this.stepListNode.empty();
            if (!this.app.document) {
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
        getHistoryStepAsListElement(step) {
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
        onHistoryStepClick(event) {
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
        registerEventHandlers() {
            this.app.eventManager.registerEventHandler(this.historyChangeHandler);
            this.app.eventManager.registerEventHandler(this.documentChangedHandler);
            this.app.eventManager.registerEventHandler(this.historyStepClickHandler);
        }
        /**
         * Unregister all events handlers from the event manager.
         *
         * @author Camille Gobert
         */
        unregisterEventHandlers() {
            this.app.eventManager.unregisterEventHandler(this.historyChangeHandler);
            this.app.eventManager.unregisterEventHandler(this.documentChangedHandler);
            this.app.eventManager.unregisterEventHandler(this.historyStepClickHandler);
        }
    }
    exports.HistoryList = HistoryList;
});
