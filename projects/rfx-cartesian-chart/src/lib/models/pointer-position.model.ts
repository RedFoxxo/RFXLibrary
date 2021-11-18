import { CoordinatesModel } from "./coordinates.model";

export interface PointerPositionModel extends CoordinatesModel {
  isDot: boolean;
  dotColor?: string;
  xDot?: number;
  yDot?: number;
}
