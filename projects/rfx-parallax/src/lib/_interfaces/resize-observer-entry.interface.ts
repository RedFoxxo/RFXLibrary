import { ResizeObserverSizeInterface } from './resize-observer-size.interface';

export interface ResizeObserverEntryInterface {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSizeInterface>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSizeInterface>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSizeInterface>;
}
