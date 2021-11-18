import { RectModel } from "./rect.model";
import { LineModel } from "./line.model";
import { CartesianElementModel } from "./cartesian-element.model";

export interface CacheModel {
  xAxisLine: LineModel;
  yAxisLine: LineModel;

  xAxisValues: LineModel[];
  yAxisValues: LineModel[];

  xAxisLabels: string[];
  yAxisLabels: string[];

  drawableRect: RectModel;
  zeroLine: LineModel | null;
  gridLines: LineModel[];

  points: CartesianElementModel[];
  lines: LineModel[][] | null[];
}
