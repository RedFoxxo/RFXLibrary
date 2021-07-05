import { ResizeObserverSizeModel } from './resize-observer-size.model';

export interface ResizeObserverEntryModel {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSizeModel>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSizeModel>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSizeModel>;
}
