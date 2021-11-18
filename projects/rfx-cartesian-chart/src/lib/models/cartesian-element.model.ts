import { CoordinatesModel } from "./coordinates.model";
import { CartesianElementTypeEnum } from "./cartesian-element-type.enum";

export interface CartesianElementModel {
  name: string;
  color: string;
  width?: number;
  opacity?: number;
  type: CartesianElementTypeEnum;
  points: CoordinatesModel[];
  dash?: [number, number] | null;
  isLineHidden?: boolean;
  areDotsHidden?: boolean;
}
