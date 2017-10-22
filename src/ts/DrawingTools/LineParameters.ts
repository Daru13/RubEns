import * as Params from "../Parameter";
import { Color } from "../utils/Color";

/**
 * The parameters given by the user tp draw lines
 */
export class LineParameters {
    thickness: Params.NumberParameter;
    color: Params.ColorParameter;

    /**
     * Basic constructor
     *
     *@author Josselin GIET
     *
     */
    constructor () {
        this.thickness = {
            value: 20,
            kind: Params.ParameterKind.Number,
            name: "Thickness",
            min: 2,
            step: 1
        };
        this.color = {
            value: "",
            kind: Params.ParameterKind.Color,
            name: "Color"
        }
    }
}
