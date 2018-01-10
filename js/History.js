define(["require", "exports", "./EventManager", "./HistoryStep"], function (require, exports, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This is a generic history for a single document.
     * Each step is saved in a "HistoryStep" For more details see [[HistoryStep]]
     */
    class History {
        /**
         * The constructor that initializes the History
         * by adding an *empty* step with the image in the beginning.
         * @param  {Document} document Returns nothing : works by side-effect.
         * @return {[type]}            A reference to the document whose actions have to be storred.
         *
         * @author Josselin GIET
         */
        constructor(document, eventManager) {
            /**
             * The list of the actions applied on the document and storred.
             */
            this.listOfActions = [];
            /**
             * The upper bound of steps that can be saved in the history.
             * If we reach this limit, we delete the latest saved step.
             */
            this.boundOnStep = 50;
            /**
             * This EventHandler is called for saving a step.
             */
            this.handleSaveStep = {
                eventTypes: ["rubens_historySaveStep"],
                callback: (event) => {
                    this.saveStep(event.detail);
                }
            };
            this.document = document;
            let firstImageData = this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.listOfActions[0] = new HistoryStep_1.EditLayerStep("Creating the document", firstImageData, firstImageData, this.document.imageWorkspace.drawingLayers.selectedLayer.id);
            this.firstAvailableStep = 0;
            this.latestAvailableStep = 0;
            this.currentStep = 0;
            this.eventManager = eventManager;
            this.eventManager.registerEventHandler(this.handleSaveStep);
        }
        /**
         * This function delete the history between the current step and this.latestAvailableStep.
         * This function is called when we have to save a new step
         * but the curent step is not the head of the history.
         * @return {[void]} Returns nothing : works by side effect on the history.
         *
         * @author Josselin GIET
         */
        clearHead() {
            if (this.currentStep < this.latestAvailableStep) {
                for (let i = this.currentStep + 1; i <= this.latestAvailableStep; i++) {
                    delete this.listOfActions[i];
                }
            }
            this.latestAvailableStep = this.currentStep;
        }
        /**
         * This function stores the step given in argument in the history.
         * @param  {HistoryStep} step the step to save.
         * @return {void}             returns nothing, works by side-effect.
         */
        saveStep(step) {
            this.clearHead();
            this.currentStep++;
            this.latestAvailableStep++;
            for (let i = this.firstAvailableStep; i < this.currentStep - this.boundOnStep; i++) {
                this.listOfActions[i] = null;
            }
            if (step.type == "GenericHistoryStep") {
                this.listOfActions[this.currentStep] = step;
            }
            else if (step.type == "EditLayerStep") {
                let layerStep = step;
                let id = layerStep.layerId;
                // We check if there is an EditLayerStep for the same layer
                let i = this.currentStep - 1;
                while (true) {
                    // We check if we reach the limit of actions.
                    if (i < this.firstAvailableStep) {
                        break;
                    }
                    else if (this.listOfActions[i].type == "EditLayerStep") {
                        // We check if it is a correct candidate.
                        let stepCandidate = this.listOfActions[i];
                        if (stepCandidate.layerId == id) {
                            break;
                        }
                    }
                    i--;
                }
                // If we didn't find a candidate
                if (i < this.firstAvailableStep) {
                    this.listOfActions[this.currentStep] = step;
                }
                else {
                    let candidateStep = this.listOfActions[i];
                    // ... we share the reference.
                    layerStep.previousImageData = candidateStep.newImageData;
                    this.listOfActions[this.currentStep] = layerStep;
                }
            }
            else if (step.type == "EditSelectionStep") {
                let selectionStep = step;
                // We check if there is an EditSelectionStep.
                let i = this.currentStep - 1;
                while (true) {
                    // We check if we reach the limit of actions.
                    if (i < this.firstAvailableStep) {
                        break;
                    }
                    else if (this.listOfActions[i].type == "EditSelectionStep") {
                        break;
                    }
                    i--;
                }
                // If we didn't find a candidate
                if (i < this.firstAvailableStep) {
                    this.listOfActions[this.currentStep] = step;
                }
                else {
                    let candidateStep = this.listOfActions[i];
                    // ... we share the reference.
                    selectionStep.previousSelection = candidateStep.newSelection;
                    this.listOfActions[this.currentStep] = selectionStep;
                }
            }
        }
        /**
         * This function put the image in the step given in argument.
         * It doesn't change the history.
         * So we can have a currentStep that is not the head of the History.
         * Therefore, we can undo this function.
         * @param  {number} stepNumber The step to reach
         * @return {void} Returns nothing : works by side-effect.
         *
         * @author Josselin GIET
         */
        goToStep(stepNumber) {
            if (stepNumber > this.latestAvailableStep || stepNumber < this.firstAvailableStep) {
                return;
            }
            if (stepNumber > this.currentStep) {
                for (let i = this.currentStep + 1; i <= stepNumber; i++) {
                    this.listOfActions[i].redo(this.document);
                    EventManager_1.EventManager.spawnEvent("rubens_redo");
                }
            }
            else {
                for (let i = this.currentStep; i > stepNumber; i--) {
                    this.listOfActions[i].undo(this.document);
                    EventManager_1.EventManager.spawnEvent("rubens_undo");
                }
            }
            this.currentStep = stepNumber;
        }
        /**
         * This function go to latest step. i.e. : currentStep-1
         * @return {void} Returns nothing : works by side-effect.
         *
         * @author Josselin GIET
         */
        goToLatestStep() {
            this.goToStep(this.currentStep - 1);
            EventManager_1.EventManager.spawnEvent("rubens_undo");
        }
        /**
         * This function go to next step. i.e. : currentStep+1
         * @return {void} Returns nothing : works by side-effect.
         *
         * @author Josselin GIET
         */
        goToNextStep() {
            this.goToStep(this.currentStep + 1);
            EventManager_1.EventManager.spawnEvent("rubens_redo");
        }
    }
    exports.History = History;
});
