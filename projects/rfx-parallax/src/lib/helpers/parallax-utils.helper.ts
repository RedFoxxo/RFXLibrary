import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, SimpleChange } from "@angular/core";
import { ParallaxBoundariesModel, ElementDimensionsModel } from "../models";

@Injectable()
export class ParallaxUtilsHelper {
  /**
   * Is platform browser.
   * False for example when using SSR.
   * @type {boolean}
   */
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Check i at least one value changed in array
   * of SimpleChange object list.
   * @param {SimpleChanges[]} changes
   * @returns {boolean}
   */
  public isAtLeastOneValueChanged(...changes: SimpleChange[]): boolean {
    return changes.some((change: SimpleChange) => this.isValueChanged(change));
  }

  /**
   * Check if value has changed.
   * You can specify if new value is equal to a particular value.
   * @param {SimpleChange} change - SimpleChange object
   * @param {any} value - check if new value is equal to this value
   * @returns {boolean}
   */
  public isValueChanged(change: SimpleChange, newValue: any = change?.currentValue): boolean {
    return change?.firstChange === false && change?.currentValue !== undefined && change?.currentValue === newValue;
  }

  /**
   * Get parallax image boundaries.
   * This data is used to calculate parallax values
   * necessary to animate parallax image.
   * WINDOW support is required!
   * @param {number} scrollTop - page scroll top
   * @param {HTMLElement} container - container html element
   * @param {number} imageHeight - parallaxed image height
   * @param {number} parallaxPercentage - parallax percentage
   * @return {ParallaxBoundariesModel} - parallax boundaries
   */
   public getParallaxBoundaries(scrollTop: number, container: HTMLElement, imageHeight: number, parallaxPercentage: number): ParallaxBoundariesModel {
    const elementTop: number = container.getBoundingClientRect().top + scrollTop;
    const usablePixels: number = container.clientHeight / 100 * parallaxPercentage;
    const unusablePixels: number = imageHeight - container.clientHeight - usablePixels;
    const startPoint: number = elementTop - usablePixels - window.innerHeight;
    const endPoint = elementTop + container.clientHeight + usablePixels;
    const totalPixels = endPoint - startPoint;
    return { startPoint, endPoint, totalPixels, usablePixels, unusablePixels };
  }

  /**
   * Get image left position in pixels based on container width,
   * image width and parallax X axis position percentage.
   * @param {HTMLElement} container - container html element
   * @param {number} imageWidth - parallaxed image width
   * @param {number} xAxisPositionPercentage - parallax X axis position percentage
   * @returns {number} - image left position in pixels
   */
  public getImageLeftPositionPx(containerWidth: number, imageWidth: number, xAxisPositionPercentage: number): number {
    return (containerWidth - imageWidth) / 100 * xAxisPositionPercentage;
  }

  /**
   * Get image top position when image is disabled.
   * @param {ParallaxBoundariesModel} boundaries - parallax boundaries
   * @returns {number} - image top position in pixels
   */
  public getImageTopPositionDisabled(boundaries: ParallaxBoundariesModel): number {
    return (-boundaries.usablePixels - boundaries.unusablePixels) / 2;
  }

  /**
   * Get image top position.
   * @param {ParallaxBoundariesModel} boundaries - parallax boundaries
   * @param {number} scrollTop - page scroll top
   * @returns {number} - image top position in pixels
   */
  public getImageTopPosition(boundaries: ParallaxBoundariesModel, scrollTop: number): number {
    const area: number = Math.max(0, Math.min(scrollTop - boundaries.startPoint, boundaries.totalPixels));
    const areaPercentage: number = 100 / boundaries.totalPixels * area;
    return -boundaries.usablePixels * (1 - areaPercentage / 100) - boundaries.unusablePixels / 2;
  }

  /**
   * Get image size.
   * Calculate image size based on user-defined parameters.
   * @param {HTMLImageElement} image - parallaxed image
   * @param {number} containerWidth - html container width
   * @param {number} containerHeight - html container height
   * @param {number} parallaxPercentage - parallax percentage
   * @param {boolean} isDisabled - true to disable parallax effect
   * @param {boolean} isAdaptiveDisabled - true to force image size to container width
   */
  public getImageSize(image: HTMLImageElement, containerWidth: number, containerHeight: number, parallaxPercentage: number, isDisabled: boolean, isAdaptiveDisabled: boolean): ElementDimensionsModel {
    if (isAdaptiveDisabled) {
      return { width: `${containerWidth}px`, height: 'auto' };
    }

    const minimumHeight: number = (containerHeight * (100 + (isDisabled ? 0 : parallaxPercentage))) / 100;
    const ratio: number = image.naturalHeight / image.naturalWidth;
    const minimumRatio: number = minimumHeight / containerWidth;

    if (ratio > minimumRatio) {
      return { width: `${containerWidth}px`, height: 'auto' };
    }

    return { width: 'auto', height: `${minimumHeight}px` };
  }
}
