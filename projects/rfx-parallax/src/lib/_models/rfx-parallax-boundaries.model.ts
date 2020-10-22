export class RfxParallaxBoundariesModel {
  public startPoint: number;
  public endPoint: number;
  public startPointUsable: number;
  public endPointUsable: number;
  public startPointVisible: number;
  public endPointVisible: number;

  constructor(
    startPoint: number,
    endPoint: number,
    startPointUsable: number,
    endPointUsable: number,
    startPointVisible: number,
    endPointVisible: number
  ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.startPointUsable = startPointUsable;
    this.endPointUsable = endPointUsable;
    this.startPointVisible = startPointVisible;
    this.endPointVisible = endPointVisible;
  }
}
