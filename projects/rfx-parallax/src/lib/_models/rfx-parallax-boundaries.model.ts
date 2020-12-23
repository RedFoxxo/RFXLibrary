export class RfxParallaxBoundariesModel {
  public startPoint: number;
  public endPoint: number;
  public totalPixels: number;
  public usablePixels: number;
  public unusablePixels: number;

  constructor(
    startPoint: number,
    endPoint: number,
    totalPixels: number,
    usablePixels: number,
    unusablePixels: number
  ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.totalPixels = totalPixels;
    this.usablePixels = usablePixels;
    this.unusablePixels = unusablePixels;
  }
}
