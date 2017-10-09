import { Color } from "../utils/Color";

export interface Parameter<T> {
    value: T;
    hidden?: boolean;
}

export interface NumberParameter extends Parameter<number> {
    min?: number;
    max?: number;
    step?: number;
}

export interface StringParameter extends Parameter<string> {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export interface ColorParameter extends Parameter<Color> {

}
