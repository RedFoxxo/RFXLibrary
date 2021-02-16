import { Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMAGE_ANIMATION } from '../../_animations';
import { RfxImageDataInterface, RfxImageInterface } from '../../_interfaces';
import { SortImagesByPriorityPipe } from '../../_pipes';
import { ImageService, RfxLoaderListenersService } from '../../_services';

@Component({
  selector: '[libRfxImageLoader]',
  templateUrl: './rfx-image-loader.component.html',
  styleUrls: ['./rfx-image-loader.component.less'],
  animations: [IMAGE_ANIMATION]
})
export class RfxImageLoaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public imageUrls: RfxImageInterface[];

  @Input()
  @HostBinding('style.background-color')
  public placeholderColor: string;

  @Input()
  public imageWidthPx!: number; // TODO: undefined

  @Input()
  public imageHeightPx!: number; // TODO: undefined

  @Input()
  public animationDurationMs: number;

  @Input()
  public animationTimingFunction: string;

  // @Output()
  // public onImageLoaded: EventEmitter<undefined>;

  public imageData: RfxImageDataInterface[];
  private windowResizeSubscription!: Subscription;

  constructor(
    private rfxLoaderListenersService: RfxLoaderListenersService,
    private rfxImageService: ImageService,
    private sortImagesByPriorityPipe: SortImagesByPriorityPipe,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.placeholderColor = 'transparent';
    this.animationDurationMs = 1000;
    this.animationTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.imageUrls = new Array<RfxImageInterface>();
    this.imageData = new Array<RfxImageDataInterface>();
    // this.onImageLoaded = new EventEmitter<undefined>();
  }

  public ngOnDestroy(): void {
    this.windowResizeSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribeToWindowResize();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.imageUrls?.currentValue) {
      const containerHeight: number = this.getContainerHeight(this.elementRef.nativeElement.clientWidth);
      this.setContainerHeight(this.elementRef.nativeElement, containerHeight);
      this.loadImages(changes.imageUrls.currentValue);
    }
  }

  private async loadImages(images: RfxImageInterface[]): Promise<void> {
    const sortedImages: RfxImageInterface[] = this.sortImagesByPriorityPipe.transform(images);

    for (const image of sortedImages) {
      const imageData = await this.rfxImageService.getImage(image.imageUrl).toPromise();
      this.imageData.push({
        imageUrl: image.imageUrl,
        priority: image.priority,
        data: imageData
      });
    }
  }

  public imageAnimationEnd(image: RfxImageDataInterface): void {
    if (this.imageData.length > 1) {
      const position = this.imageData.findIndex((_image: RfxImageDataInterface) => _image === image);

      if (position) {
        this.imageData.splice(position - 1, 1);
      }
    }
  }

  private getContainerHeight(containerWidth: number): number {
    const ratio: number = this.imageWidthPx / this.imageHeightPx;
    return containerWidth / ratio;
  }

  private setContainerHeight(container: HTMLElement, containerHeight: number): void {
    this.renderer.setStyle(container, 'height', `${containerHeight}px`);
  }

  private subscribeToWindowResize(): void {
    this.windowResizeSubscription = this.rfxLoaderListenersService.getWindowResize().subscribe(() => {
      // TODO: UPDATE HEIGHT / WIDTH OF CONTAINER
    });
  }

  // const imageSize = this.getImageSize().then((size: IRect) => {
  //   console.warn(size, image.complete);
  // });

  // private getImageSize(): Promise<IRect> {
  //   return new Promise<IRect>((resolve) => {
  //     const poll = setInterval(() => {
  //       if (this.image.naturalWidth) {
  //         clearInterval(poll);
  //         resolve({
  //           width: this.image.naturalWidth,
  //           height: this.image.naturalHeight
  //         });
  //       }
  //     }, 10);
  //   });
  // }
}
