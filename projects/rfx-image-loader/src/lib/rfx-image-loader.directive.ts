import { animate, AnimationBuilder, AnimationFactory, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';
import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { RfxImageLoaderService } from './rfx-image-loader.service';


// TODO:
// - Lazy loading
// - Auto size (no imageWidthPx / imageHeightPx required)
// - Comment code

@Directive({
  selector: '[libRfxImageLoader]'
})
export class RfxImageLoaderDirective implements OnInit, OnChanges {
  @Input() public imageUrl: string | undefined;
  @Input() public placeholderImageUrl: string | undefined;
  @Input() public placeholderColor: string | undefined;
  @Input() public imageWidthPx!: number; // TODO: undefined
  @Input() public imageHeightPx!: number; // TODO: undefined

  @Output() public onImageLoaded: EventEmitter<undefined>;

  private image: HTMLImageElement;
  private placeholderImage: HTMLImageElement;

  constructor(
    private htmlElement: ElementRef,
    private renderer: Renderer2,
    private animationBuilder: AnimationBuilder,
    private rfxImageLoaderService: RfxImageLoaderService
  ) {
    this.image = new Image();
    this.placeholderImage = new Image();
    this.onImageLoaded = new EventEmitter<undefined>();
  }

  public ngOnInit(): void {
    this.subscribeToWindowResize();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.imageUrl?.currentValue) {
      this.loadContainer(changes.imageUrl.currentValue);
    }
  }

  private loadContainer(imageUrl: string): void {
    const containerHeight: number = this.getContainerHeight(this.htmlElement.nativeElement.clientWidth);
    this.setContainerHeight(this.htmlElement.nativeElement, containerHeight);
    this.setContainerDefaultStyle();

    if (this.placeholderColor) {
      this.setPlaceholderColor(this.placeholderColor);
    }

    if (this.placeholderImageUrl) {
      this.setImageDefaultStyle(this.placeholderImage);
      this.setImage(this.placeholderImage, this.placeholderImageUrl);
    }

    this.setImageDefaultStyle(this.image, 1);
    this.setImage(this.image, imageUrl);
  }

  private getContainerHeight(containerWidth: number): number {
    const ratio: number = this.imageWidthPx / this.imageHeightPx;
    return containerWidth / ratio;
  }

  private setContainerHeight(container: HTMLElement, containerHeight: number): void {
    this.renderer.setStyle(container, 'height', `${containerHeight}px`);
  }

  private setPlaceholderColor(color: string): void {
    const animation: AnimationMetadata[] = this.getContainerAnimation(color);
    this.animate(this.htmlElement.nativeElement, animation);
  }

  private setImage(image: HTMLImageElement, imageUrl: string): void {
    image.src = imageUrl;
    image.onload = () => this.appendImage(image);
  }

  private setImageDefaultStyle(image: HTMLImageElement, priority: number = 0): void {
    this.renderer.setStyle(image, 'width', '100%');
    this.renderer.setStyle(image, 'display', 'flex');
    this.renderer.setStyle(image, 'z-index', priority);
    this.renderer.setStyle(image, 'position', 'absolute');
    this.renderer.setStyle(image, 'left', '0');
    this.renderer.setStyle(image, 'top', '0');
  }

  private setContainerDefaultStyle(): void {
    this.renderer.setStyle(this.htmlElement.nativeElement, 'position', 'relative');
  }

  private animate(element: HTMLElement, animation: AnimationMetadata[]): void {
    const factory: AnimationFactory = this.animationBuilder.build(animation);
    const player: AnimationPlayer = factory.create(element);
    player.play();

    if (element === this.image) {
      player.onDone(() => this.onImageLoaded.emit());
    }
  }

  private getContainerAnimation(color: string): AnimationMetadata[] {
    return [
      style({ 'background-color': 'transparent' }),
      animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ 'background-color': color }))
    ];
  }

  private getImageAnimation(): AnimationMetadata[] {
    return [
      style({ opacity: '0' }),
      animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: '1' })),
    ];
  }

  private appendImage(image: HTMLImageElement): void {
    this.renderer.appendChild(this.htmlElement.nativeElement, image);
    const animation: AnimationMetadata[] = this.getImageAnimation();
    this.animate(image, animation);
  }

  private subscribeToWindowResize(): void {
    this.rfxImageLoaderService.getWindowResize().subscribe(() => {
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
