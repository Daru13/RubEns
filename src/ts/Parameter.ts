import { Color } from "./utils/Color";

export enum ParameterKind {
    Number = "number",
    String = "string",
    Color = "color"
};

/**
 * Generic interface for a raw parameter which can be exposed by the UI to the user.
 * However, it should not be used directly. Instead, a specialized interface should
 * be defined for every type of parameter (see below).
 *
 * @type {T} T Type of the parameter value.
 */
export interface Parameter<T> {
    /**
     * Value of the parameter.
     */
    value: T;

    /**
     * Kind of parameter.
     * It defines what does the parameter represent, independently of the value type.
     */
    kind: ParameterKind;

    /**
     * Optionnal name of the parameter.
     * If defined, the UI may display it next to the value controller.
     */
    name?: string;

    /**
     * Optionnal flag controlling the visibility of this parameter in the UI.
     * If defined and set to `true`, the UI must not display this parameter.
     */
    hidden?: boolean;
}

/**
 * Specialized parameter interface for parameters whose value is a number.
 */
export interface NumberParameter extends Parameter<number> {
    kind: ParameterKind.Number;

    /**
     * Optionnal inimum value allowed.
     */
    min?: number;

    /**
     * Optionnal aximum value allowed.
     */
    max?: number;

    /**
     * Optionnal increment and decrement step.
     */
    step?: number;
}

/**
 * Specialized parameter interface for parameters whose value is a string.
 */
export interface StringParameter extends Parameter<string> {
    kind: ParameterKind.String;

    /**
     * Optionnal minimum length allowed.
     */
    minLength?: number;

    /**
     * Optionnal maximum length allowed.
     */
    maxLength?: number;

    /**
     * Optionnal regular expression which must match the value.
     */
    pattern?: RegExp;
}

/**
 * Specialized parameter interface for parameters whose value is a color.
 */
export interface ColorParameter extends Parameter<string> {
    kind: ParameterKind.Color;

}
