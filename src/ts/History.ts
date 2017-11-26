

type HistoryFunction = () => void;


export interface HistoryStep {
    redo: HistoryFunction;
    undo?: HistoryFunction;
    image?: ImageData;
    nearestForwardImage: number;
    nearestBackwardImage: number;
    numberOfActionOnCanvs: number;
}

export interface HistoryMap {
    map: HistoryStep[];
    firstAvailableStep: number;
    numberOfStep: number;
    numberOfImages: number;
    currentStep: number;
}

export class History {
    historyMap: HistoryMap;
    apply: (redo: HistoryFunction, undo?: HistoryFunction) => void;
    applyOnCanvas: (redo: HistoryFunction, undo?: HistoryFunction) => void;
    goToStep: (step: number) => void;
}

export class ImageHistory implements History {


    historyMap = {
        map: [],
        firstAvailableStep: 0,
        numberOfStep: 0,
        numberOfImages: 0,
        currentStep: 0,
    };

    //Maybe a function to initiate the map (e.g. with the new image)

    boundOnImages: number = 10;
    boundOnCanvas: number = 10;

    /**
     * This function stores the functions given in argument.
     * @param  {HistoryFunction} redo [description]
     * @param  {HistoryFunction} undo [description]
     * @return {void}
     */
    apply(redo: HistoryFunction, undo?: HistoryFunction){
        if (this.historyMap.currentStep < this.historyMap.numberOfStep) {
        // First, we have to clear the hstory, for the current step is not the head of history
            for (var i = this.historyMap.currentStep+1; i <this.historyMap.numberOfStep; i++){
                this.historyMap.map[i] = null;
            }
            this.historyMap.numberOfStep = this.historyMap.numberOfStep;
            for (var i = this.historyMap.numberOfStep; i < this.historyMap.map[this.historyMap.currentStep].nearestBackwardImage; i++){
                this.historyMap.map[i].nearestForwardImage = -1;
            }

        }
        this.historyMap.currentStep += 1;
        this.historyMap.numberOfStep += 1;
        this.historyMap.map[this.historyMap.numberOfStep] =
            {redo: redo,
             undo: undo,
             image: null,
             nearestForwardImage: -1,
             nearestBackwardImage: this.historyMap.map[this.historyMap.numberOfStep-1].nearestBackwardImage,
             numberOfActionOnCanvs: this.historyMap.map[this.historyMap.numberOfStep-1].numberOfActionOnCanvs,
        }
        redo();
    }



    /**
     * [applyOnCanvas description]
     * @param  {HistoryFunction} redo [description]
     * @param  {HistoryFunction} undo [description]
     * @return {void}               [description]
     */
    applyOnCanvas(redo: HistoryFunction, undo?: HistoryFunction){
        if (this.historyMap.currentStep < this.historyMap.numberOfStep) {
        // First, we have to clear the hstory, if the current step is not the head of history
            for (var i = this.historyMap.currentStep+1; i <this.historyMap.numberOfStep; i++){
                this.historyMap.map[i] = null;
            }
            this.historyMap.numberOfStep = this.historyMap.numberOfStep;
            for (var i = this.historyMap.numberOfStep; i < this.historyMap.map[this.historyMap.currentStep].nearestBackwardImage; i++){
                this.historyMap.map[i].nearestForwardImage = -1;
            }

        }
        this.historyMap.currentStep += 1;
        this.historyMap.numberOfStep += 1;
        // Then, we increment the numpber of steps.
        if (this.historyMap.map[this.historyMap.currentStep-1].numberOfActionOnCanvs <= this.boundOnCanvas){
        // Then we check if we have reached the number of action on cnvas between two images.
            this.historyMap.map[this.historyMap.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: null,
                 nearestForwardImage: -1,
                 nearestBackwardImage: this.historyMap.map[this.historyMap.numberOfStep-1].nearestBackwardImage,
                 numberOfActionOnCanvs: this.historyMap.map[this.historyMap.numberOfStep-1].numberOfActionOnCanvs +1,
            }
        }
        else {
            if (this.historyMap.numberOfImages > this.boundOnImages) {
                // First, we clear the latest stored image, if we reached the limit.
                var beginning = this.historyMap.firstAvailableStep;
                var end = this.historyMap.map[beginning+1].nearestForwardImage;
                for (var i = beginning; i < end; i++){
                    this.historyMap.map[i] = null;
                }
                this.historyMap.firstAvailableStep = end;
            }
            // Then, we
            var thisStep: number = this.historyMap.numberOfStep;
            for (var i: number = this.historyMap.map[thisStep-1].nearestBackwardImage+1; i < thisStep; i++){
                this.historyMap.map[i].nearestForwardImage = thisStep;
            }

            this.historyMap.map[this.historyMap.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: null, //TODO : add getImageData
                 nearestForwardImage: this.historyMap.numberOfStep,
                 nearestBackwardImage: this.historyMap.numberOfStep,
                 numberOfActionOnCanvs: this.historyMap.map[this.historyMap.numberOfStep-1].numberOfActionOnCanvs +1,
                }
            this.historyMap.numberOfImages ++;
        }
        redo();
    }


    goToStep(stepNumber: number){
        if (stepNumber > this.historyMap.numberOfStep || stepNumber < this.historyMap.firstAvailableStep){
            return null;
        }
        var step: HistoryStep = this.historyMap.map[stepNumber];

        // We check if we can use the undo function.
        var useUndo: boolean = true;
        if (step.nearestForwardImage == -1){ useUndo = false; }
        if (useUndo && (stepNumber - step.nearestBackwardImage < step.nearestForwardImage - stepNumber)){
            useUndo = false;
        }
        for(var i = stepNumber + 1; useUndo && (i < step.nearestForwardImage); i++){
            if (this.historyMap.map[i].undo != null) { useUndo = false; }
        }
        // Dependeing on the results of everal check above, we use undo function, or not.
        if (useUndo) {
            // put a setImageData
            for (var i = step.nearestForwardImage-1; i > stepNumber; i--){
                this.historyMap.map[i].undo();
            }
        }
        else {
            // getImageData
            for (var i = step.nearestBackwardImage; i <= stepNumber; i++){
                this.historyMap.map[i].redo();
            }
        }
        this.historyMap.currentStep = stepNumber;
    }


}
