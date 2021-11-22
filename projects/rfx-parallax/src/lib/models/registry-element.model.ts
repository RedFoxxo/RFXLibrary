import {
  RfxParallaxComponent,
  RfxParallaxImageComponent
} from "../components";

export interface RegistryElementModel {
  isReady: boolean;
  element: RfxParallaxComponent | RfxParallaxImageComponent
}
