import { Document } from "./Document";
import { EventManager } from "./EventManager";
import { EventHandler } from "./EventHandler";
import { HistoryStep } from "./HistoryStep";
import { EditLayerStep } from "./HistoryStep";
import { EditSelectionStep } from "./HistoryStep"
import { GenericHistoryStep } from "./HistoryStep"


/**
 * This is a generic history for a single document.
 * Each step is saved in a "HistoryStep" For more details see [[HistoryStep]]
 */
export class History {

    /**
     * The document whose history is registered.
     */
    document: Document;

    /**
     * The event manager used to dispatch events
     */
    eventManager: EventManager;


    /**
     * The list of the actions applied on the document and storred.
     */
    listOfActions: HistoryStep[] = [];

    /**
     * The first (i.e. in time) available step.
     * We cannot go later in the history.
     */
    firstAvailableStep: number;

    /**
     * The latest available step. We cannot go further.
     */
    latestAvailableStep: number;

    /**
     * The curent state of the image in the history.
     * It might be different from latestAvailableStep.
     * See the function goToStep.
     */
    currentStep: number;

    /**
     * The upper bound of steps that can be saved in the history.
     * If we reach this limit, we delete the latest saved step.
     */
    boundOnStep: number = 50;


    /**
     * This EventHandler is called for saving a step.
     */
    handleSaveStep: EventHandler = {
        eventTypes: ["rubens_historySaveStep"],
        callback : (event: CustomEvent) => {
            this.saveStep(event.detail)
        }
    }

    /**
     * The constructor that initializes the History
     * by adding an *empty* step with the image in the beginning.
     * @param  {Document} document Returns nothing : works by side-effect.
     * @return {[type]}            A reference to the document whose actions have to be storred.
     *
     * @author Josselin GIET
     */
    constructor(document: Document, eventManager: EventManager){
        this.document = document;
        let firstImageData = this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.getImageData();
        this.listOfActions[0] = new EditLayerStep(
            "Creating the document",
            firstImageData,
            firstImageData,
            this.document.imageWorkspace.drawingLayers.selectedLayer.id,
        )

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
            for (let i = this.currentStep+1; i <= this.latestAvailableStep; i++){
                delete this.listOfActions[i];
            }
        }
    }

    /**
     * This function stores the step given in argument in the history.
     * @param  {HistoryStep} step the step to save.
     * @return {void}             returns nothing, works by side-effect.
     */
    saveStep(step: HistoryStep){
        this.clearHead();
        this.currentStep++;
        console.log("Saving "+step.description);
        console.log(this.currentStep);
        this.latestAvailableStep++;
        for (let i = this.firstAvailableStep; i < this.currentStep - this.boundOnStep; i++){
            this.listOfActions[i] = null;
        }
        if (step.type == "GenericHistoryStep"){
            console.log(step.type);
            this.listOfActions[this.currentStep] = step;
        }
        else if (step.type == "EditLayerStep"){
            console.log(step.type);
            let layerStep = <EditLayerStep> step;
            let id = layerStep.layerId;

            // We check if there is an EditLayerStep for the same layer
            let i: number = this.currentStep-1;
            while(true){
                // We check if we reach the limit of actions.
                if (i < this.firstAvailableStep){
                    break;
                }
                // We check if this step is from the right type.
                else if (this.listOfActions[i].type == "EditLayerStep"){
                    // We check if it is a correct candidate.
                    let stepCandidate = <EditLayerStep> this.listOfActions[i];
                    if (stepCandidate.layerId == id){
                        break
                    }
                }
                i--;
            }

            // If we didn't find a candidate
            if (i < this.firstAvailableStep){
                this.listOfActions[this.currentStep] = step
            }
            // If we find a candidate ...
            else {
                let candidateStep = <EditLayerStep>this.listOfActions[i];
                console.log(i)
                // ... we share the reference.
                layerStep.previousImageData = candidateStep.newImageData;
                this.listOfActions[this.currentStep] = layerStep;
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
    goToStep(stepNumber: number){
        console.log("GoToStep")
        console.log(stepNumber);
        if (stepNumber > this.latestAvailableStep || stepNumber < this.firstAvailableStep){
            return;
        }
        if (stepNumber > this.currentStep){
            for (let i = this.currentStep +1; i <= stepNumber; i++){
                this.listOfActions[i].redo(this.document);
            }
        }
        else {
            for (let i = this.currentStep; i > stepNumber; i--){
                this.listOfActions[i].undo(this.document);
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
    goToLatestStep () {
        this.goToStep(this.currentStep -1);
    }

    /**
     * This function go to next step. i.e. : currentStep+1
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    goToNextStep(){
        this.goToStep(this.currentStep+1);
    }

}
