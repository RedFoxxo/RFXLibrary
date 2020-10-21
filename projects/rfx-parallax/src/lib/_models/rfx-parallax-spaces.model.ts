export class RfxParallaxSpacesModel {
  public available: number;
  public usable: number;
  public unusable: number;

  constructor(
    available: number,
    usable: number,
    unusable: number
  ) {
    this.available = available;
    this.usable = usable;
    this.unusable = unusable;
  }
}
