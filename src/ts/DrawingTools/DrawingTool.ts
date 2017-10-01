import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";

export interface DrawingTool {
    apply(image: Canvas, parameters: DrawingParameters);
}