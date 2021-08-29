import { AnimationExpParamsInterface } from "./animation-exp-params.interface";
import { AnimationVisibilityEnum } from "./animation-visiblity.enum";

export interface AnimationExpInterface {
  value: AnimationVisibilityEnum;
  params: AnimationExpParamsInterface;
}
