export class RfxParallaxBoundariesModel {
  public startPoint: number;
  public endPoint: number;
  public totalPixels: number;
  public usablePixels: number;

  constructor(
    startPoint: number,
    endPoint: number,
    totalPixels: number,
    usablePixels: number
  ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.totalPixels = totalPixels;
    this.usablePixels = usablePixels;
  }
}
