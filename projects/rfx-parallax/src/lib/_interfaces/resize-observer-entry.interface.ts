import { IResizeObserverSize } from './resize-observer-size.interface';

export interface IResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<IResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<IResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<IResizeObserverSize>;
}
