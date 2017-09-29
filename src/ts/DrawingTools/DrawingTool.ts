import { Image } from "../Image";
import { DrawingParameters } from "./DrawingParameters";

export interface DrawingTool {
    apply(image: Image, parameters: DrawingTool);
}