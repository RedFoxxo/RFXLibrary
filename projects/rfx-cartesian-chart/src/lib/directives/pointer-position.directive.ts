import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PointerPositionModel, RectModel } from '../models';

@Directive({
  selector: '[appPointerPosition]'
})
export class PointerPositionDirective {
  @Input()
  public area: RectModel | undefined;

  @Output()
  public position: EventEmitter<PointerPositionModel | undefined>;

  private isOut: boolean;
  private currentPosition: PointerPositionModel | undefined;

  constructor() {
    this.isOut = true;
    this.position = new EventEmitter<PointerPositionModel | undefined>();
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    if (!this.isOut && this.area) {
      const nextPosition: PointerPositionModel | undefined = this.getPosition(event, this.area);

      if (nextPosition !== this.currentPosition) {
        this.currentPosition = nextPosition;
        this.position.emit(this.currentPosition);
      }
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.isOut = true;
    this.position.emit(undefined);
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.isOut = false;
  }

  private getPosition(event: MouseEvent, area: RectModel): PointerPositionModel | undefined {
    const target: HTMLElement = event.target as HTMLElement;

    if (target.classList.contains('dot')) {
      const xDot: string | null = target.getAttribute('x');
      const yDot: string | null = target.getAttribute('y');

      return {
        isDot: true,
        xDot: xDot ? Number(xDot) : undefined,
        yDot: yDot ? Number(yDot) : undefined,
        dotColor: (target.attributes as any)?.color?.value,
        x: target.offsetLeft - area.left,
        y: target.offsetTop - area.top
      }
    } else {
      const x: number = event.offsetX - area.left;
      const y: number = event.offsetY - area.top;

      if (x < 0 || y < 0 || x > area.width || y > area.height) {
        return undefined;
      }

      return { x, y, isDot: false };
    }
  }
}
