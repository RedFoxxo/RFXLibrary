import { CoordinatesModel } from "./coordinates.model";

export interface DotModel {
  position: CoordinatesModel;
  radius: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  opacity?: number;
}
