import { flatten } from '@angular/compiler';
import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  DotModel, CoordinatesModel, RectModel, DimensionModel, AxisEnum, PointerPositionModel,
  CacheModel, CartesianElementModel, LineModel, RangeModel, CartesianElementTypeEnum
} from '../../models';

declare var require: any;
var CardinalSpline = require('cardinal-spline-js');

@Component({
  selector: 'lib-rfx-cartesian-chart',
  templateUrl: './cartesian-graph.component.html',
  styleUrls: ['./cartesian-graph.component.less']
})
export class CartesianGraphComponent implements OnInit, OnChanges {
  @Input()
  public labelNoData: string;

  @Input()
  public labelLoading: string;

  @Input()
  public isLoading: boolean;

  @Input()
  public fontFamily: string;

  @Input()
  public fontSizePx: number;

  @Input()
  public canvasWidthPx: number;

  @Input()
  public canvasHeightPx: number;

  @Input()
  public cartesianValues: CartesianElementModel[];

  @Input()
  public gridColor: string;

  @Input()
  public gridWidth: number;

  @Input()
  public axesColor: string;

  @Input()
  public axesWidth: number;

  @Input()
  public crosshairColor: string;

  @Input()
  public crosshairWidth: number;

  @Input()
  public xAxisPointsCount: number;

  @Input()
  public yAxisPointsCount: number;

  @Input()
  public isCrosshairEnabled: boolean;

  @Input()
  public yTopPaddingPercentage: number;

  @Input()
  public yBottomPaddingPercentage: number;

  @Input()
  public xAxisLabelPrecision: number;

  @Input()
  public yAxisLabelPrecision: number;

  @Input()
  public xCrosshairLabelPrecision: number;

  @Input()
  public yCrosshairLabelPrecision: number;

  @Input()
  public pointRadius: number;

  @Input()
  public highlightZeroLine: boolean;

  @Input()
  public zeroLineWidth: number;

  @Input()
  public zeroLineColor: string;

  @Input()
  public zeroLineOpacity: number;

  @Input()
  public zeroLineDash: [number, number];

  @Input()
  public topMarginPx: number;

  @Input()
  public leftMarginPx: number;

  @Input()
  public rightMarginPx: number;

  @Input()
  public bottomMarginPx: number;

  @ViewChild('overlays', { static: true })
  public overlays: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvas', { static: true })
  public canvas: ElementRef<HTMLCanvasElement> | undefined;

  private ctx: CanvasRenderingContext2D | null | undefined;
  public cache: CacheModel | undefined;
  private dots: HTMLElement[];
  private isReady: boolean;


  constructor(
    private renderer: Renderer2
  ) {
    this.labelNoData = 'No data available';
    this.labelLoading = 'Loading...';
    this.isLoading = false;
    this.isReady = false;
    this.fontFamily = 'Arial';
    this.canvasWidthPx = 500;
    this.canvasHeightPx = 500;
    this.cartesianValues = [];
    this.xAxisPointsCount = 10;
    this.yAxisPointsCount = 10;
    this.gridColor = '#EEEEEE';
    this.axesColor = '#212121';
    this.crosshairColor = '#BDBDBD';
    this.axesWidth = 1;
    this.gridWidth = 1;
    this.crosshairWidth = 1;
    this.isCrosshairEnabled = true;
    this.xAxisLabelPrecision = 2;
    this.yAxisLabelPrecision = 2;
    this.xCrosshairLabelPrecision = 2;
    this.yCrosshairLabelPrecision = 2;
    this.yTopPaddingPercentage = 0;
    this.yBottomPaddingPercentage = 0;
    this.pointRadius = 4;
    this.dots = [];
    this.highlightZeroLine = false;
    this.zeroLineWidth = 2;
    this.zeroLineColor = '#212121';
    this.zeroLineOpacity = 1;
    this.zeroLineDash = [2, 5];
    this.fontSizePx = 12;
    this.topMarginPx = 19.5;
    this.leftMarginPx = 59.5;
    this.rightMarginPx = 59.5;
    this.bottomMarginPx = 39.5;
  }

  public ngOnInit(): void {
    this.ctx = this.canvas?.nativeElement.getContext('2d');

    if (this.canvas && this.ctx && this.overlays) {
      this.renderer.setProperty(this.canvas.nativeElement, 'width', this.canvasWidthPx);
      this.renderer.setProperty(this.canvas.nativeElement, 'height', this.canvasHeightPx);
      this.cache = this.calculateCache(this.canvas.nativeElement);
      this.dots = this.generateOverlayDots(this.cartesianValues, this.cache.points);
      this.pushOverlayDots(this.dots, this.overlays.nativeElement);
      this.draw(this.ctx, this.cache);
      this.isReady = true;
    }
  }

  public ngOnChanges(): void {
    if (this.isReady && this.canvas && this.ctx && this.overlays) {
      this.renderer.setProperty(this.canvas.nativeElement, 'width', this.canvasWidthPx);
      this.renderer.setProperty(this.canvas.nativeElement, 'height', this.canvasHeightPx);
      this.cache = this.calculateCache(this.canvas.nativeElement);
      this.dots = this.generateOverlayDots(this.cartesianValues, this.cache.points);
      this.pushOverlayDots(this.dots, this.overlays.nativeElement);
      this.draw(this.ctx, this.cache);
    }
  }

  private calculateCache(canvas: HTMLCanvasElement): CacheModel {
    const xRangeValues: RangeModel | null = this.getPointsRange(this.cartesianValues, AxisEnum.X);
    const yRangeValues: RangeModel | null = this.getPointsRange(this.cartesianValues, AxisEnum.Y);
    const xAxisLine: LineModel = this.getXAxisLine(canvas.clientHeight, canvas.clientWidth);
    const yAxisLine: LineModel = this.getYAxisLine(canvas.clientHeight);
    const drawableRect: RectModel = this.getDrawableArea(xAxisLine, yAxisLine);
    const zeroLine: LineModel | null = this.highlightZeroLine ?
      this.getYZeroLine(drawableRect, yRangeValues, this.yTopPaddingPercentage, this.yBottomPaddingPercentage) : null;
    const xAxisValues: LineModel[] = this.getXAxisValues(xAxisLine);
    const yAxisValues: LineModel[] = this.getYAxisValues(yAxisLine);
    const yRangeOffsets: RangeModel = { min: this.yBottomPaddingPercentage, max: this.yTopPaddingPercentage };
    const xAxisLabels: string[] = this.getAxisLabels(this.xAxisPointsCount, this.xAxisLabelPrecision, xRangeValues);
    const yAxisLabels: string[] = this.getAxisLabels(this.yAxisPointsCount, this.yAxisLabelPrecision, yRangeValues, yRangeOffsets);
    const gridLines: LineModel[] = this.getGridLines(xAxisValues, yAxisValues, xAxisLine, yAxisLine);
    const points: CartesianElementModel[] = this.getPoints(this.cartesianValues, xAxisLabels, yAxisLabels, drawableRect);
    const lines: LineModel[][] | null[] = this.getLines(points);
    return { xAxisLine, yAxisLine, drawableRect, xAxisValues, yAxisValues, xAxisLabels, yAxisLabels, gridLines, points, lines, zeroLine };
  }

  private draw(ctx: CanvasRenderingContext2D, cache: CacheModel): void {
    this.drawLineWithBreaks(ctx, this.gridColor, this.gridWidth, 1, null, cache.gridLines);

    if (cache.zeroLine) {
      this.drawContinuousLine(ctx, this.zeroLineColor, this.zeroLineWidth, this.zeroLineOpacity, this.zeroLineDash, cache.zeroLine);
    }

    this.drawContinuousLine(ctx, this.axesColor, this.axesWidth, 1, null, cache.xAxisLine);
    this.drawContinuousLine(ctx, this.axesColor, this.axesWidth, 1, null, cache.yAxisLine);
    this.drawLineWithBreaks(ctx, this.axesColor, this.axesWidth, 1, null, cache.xAxisValues);
    this.drawLineWithBreaks(ctx, this.axesColor, this.axesWidth, 1, null, cache.yAxisValues);
    this.drawXAxisLabels(ctx, cache.xAxisLabels, cache.xAxisValues, cache.xAxisLine);
    this.drawYAxisLabels(ctx, cache.yAxisLabels, cache.yAxisValues, cache.yAxisLine);
    this.drawLines(ctx, cache.lines, cache.points);
    this.drawPoints(ctx, cache.points);
  }

  private generateOverlayDots(elements: CartesianElementModel[], points: CartesianElementModel[]): HTMLElement[] {
    const htmlElements: HTMLElement[] = [];

    for (let i = 0; i < points.length; i++) {
      if (!points[i].areDotsHidden) {
        for (let n = 0 ; n < points[i].points.length; n++) {
          const element: HTMLElement = this.renderer.createElement('div');
          this.renderer.addClass(element, 'dot');
          this.renderer.setStyle(element, 'width', `${this.pointRadius * 2 + 10}px`);
          this.renderer.setStyle(element, 'height', `${this.pointRadius * 2 + 10}px`);
          this.renderer.setStyle(element, 'left', `${points[i].points[n].x}px`);
          this.renderer.setStyle(element, 'top', `${points[i].points[n].y}px`);
          this.renderer.setAttribute(element, 'color', points[i].color);
          this.renderer.setAttribute(element, 'x', elements[i].points[n].x.toString());
          this.renderer.setAttribute(element, 'y', elements[i].points[n].y.toString());
          htmlElements.push(element);
        }
      }
    }

    return htmlElements;
  }

  private pushOverlayDots(dots: HTMLElement[], overlaysContainer: HTMLElement): void {
    overlaysContainer.childNodes.forEach((value: ChildNode) => {
      this.renderer.removeChild(overlaysContainer, value);
    });

    for (const dot of dots) {
      overlaysContainer.appendChild(dot);
    }
  }

  private getYZeroLine(drawableRect: RectModel, rangeValues: RangeModel | null, topPadding: number, bottomPadding: number): LineModel | null {
    if (rangeValues) {
      const min = rangeValues.min + (rangeValues.min / 100 * bottomPadding);
      const max = rangeValues.max + (rangeValues.max / 100 * topPadding);

      if (min < 0 && max > 0) {
        const y: number = drawableRect.height * max / (max - min);

        return {
          startPoint: { x: drawableRect.left, y: drawableRect.top + y },
          endPoint: { x: drawableRect.left + drawableRect.width, y: drawableRect.top + y }
        };
      }
    }

    return null;
  }

  private getXAxisLine(canvasHeight: number, canvasWidth: number): LineModel {
    return {
      startPoint: { x: this.leftMarginPx, y: canvasHeight - this.bottomMarginPx },
      endPoint: { x: canvasWidth - this.rightMarginPx, y: canvasHeight - this.bottomMarginPx }
    };
  }

  private getYAxisLine(canvasHeight: number): LineModel {
    return {
      startPoint: { x: this.leftMarginPx, y: this.topMarginPx },
      endPoint: { x: this.leftMarginPx, y: canvasHeight - this.bottomMarginPx }
    };
  }

  private getXAxisValues(line: LineModel): LineModel[] {
    const values: number[] = this.getAxisPoints(line.startPoint.x, line.endPoint.x, this.xAxisPointsCount);
    const points: LineModel[] = [];

    for (const value of values) {
      points.push({
        startPoint: { x: value, y: line.startPoint.y },
        endPoint: { x: value, y: line.startPoint.y + 5 }
      });
    }

    return points;
  }

  private getYAxisValues(line: LineModel): LineModel[] {
    const values: number[] = this.getAxisPoints(line.startPoint.y, line.endPoint.y, this.yAxisPointsCount).reverse();
    const points: LineModel[] = [];

    for (const value of values) {
      points.push({
        startPoint: { x: this.leftMarginPx - 5, y: value },
        endPoint: { x: this.leftMarginPx, y: value }
      });
    }

    return points;
  }

  private getAxisPoints(start: number, end: number, pointsCount: number): number[] {
    const points: number[] = [];

    if (pointsCount === 1) {
      const point: number = (start + end) / 2;
      const roundedPoint: number = Math.round(point - 0.5) + 0.5;
      points.push(roundedPoint);
      return points;
    }

    const step: number = (end - start) / (pointsCount - 1);

    for (let i = 0; i < pointsCount; i++) {
      const point: number = start + (step * i);
      const roundedPoint: number = Math.round(point - 0.5) + 0.5;
      points.push(roundedPoint);
    }

    return points;
  }

  private getPointsRange(values: CartesianElementModel[], axis: AxisEnum): RangeModel | null {
    if (values.length === 0) {
      return null;
    }

    const validValues: CartesianElementModel[] = values.filter(value => {
      const isAxis: boolean = [CartesianElementTypeEnum.X_AXIS_LINE, CartesianElementTypeEnum.Y_AXIS_LINE].includes(value.type);
      const isXAxis: boolean = axis === AxisEnum.X && value.type === CartesianElementTypeEnum.X_AXIS_LINE;
      const isYAxis: boolean = axis === AxisEnum.Y && value.type === CartesianElementTypeEnum.Y_AXIS_LINE;

      if ((isAxis && (isXAxis || isYAxis)) || !isAxis) {
        return true;
      }

      return false;
    });

    if (validValues.length === 0) {
      return null;
    }

    const flattened: CoordinatesModel[] = flatten(validValues.map(value => value.points));
    const axisLabels: number[] = flattened.map(value => value[axis]);
    const min: number = Math.min(...axisLabels);
    const max: number = Math.max(...axisLabels);

    return { min, max };
  }

  private getAxisLabels(pointCount: number, precision: number, rangeValue: RangeModel | null, offsetRange?: RangeModel): string[] {
    const labels: string[] = [];

    if (rangeValue) {
      if (pointCount === 1) {
        const labelValue: number = rangeValue.min;
        const label: string = this.getRoundedValueString(labelValue, precision);
        labels.push(label);
        return labels;
      }

      let minValue: number = rangeValue.min;
      let maxValue: number = rangeValue.max;

      if (offsetRange) {
        minValue += (rangeValue.min / 100 * offsetRange.min);
        maxValue += (rangeValue.max / 100 * offsetRange.max);
      }

      const step: number = (maxValue - minValue) / (pointCount - 1);

      for (let i = 0; i < pointCount; i++) {
        const labelValue: number = minValue + (step * i);
        const label: string = this.getRoundedValueString(labelValue, precision);
        labels.push(label);
      }
    }

    return labels;
  }

  private getGridLines(xAxisValues: LineModel[], yAxisValues: LineModel[], xAxisLine: LineModel, yAxisLine: LineModel): LineModel[] {
    const gridLines: LineModel[] = [];

    if (xAxisValues.length) {
      for (let i = 0; i < xAxisValues.length; i++) {
        gridLines.push({
          startPoint: { x: xAxisValues[i].startPoint.x, y: xAxisValues[i].startPoint.y },
          endPoint: { x: xAxisValues[i].endPoint.x, y: yAxisLine.startPoint.y }
        });
      }
    }

    if (yAxisValues.length) {
      for (let i = 0; i < yAxisValues.length; i++) {
        gridLines.push({
          startPoint: { x: yAxisValues[i].endPoint.x, y: yAxisValues[i].endPoint.y },
          endPoint: { x: xAxisLine.endPoint.x, y: yAxisValues[i].endPoint.y }
        });
      }
    }

    return gridLines;
  }

  private getPoints(cartesianValues: CartesianElementModel[], xAxisLabels: string[], yAxisLabels: string[], drawableRect: RectModel): CartesianElementModel[] {
    const graphPoints: CartesianElementModel[] = [];

    const xMin: number = Number(xAxisLabels[0]);
    const xMax: number = Number(xAxisLabels[xAxisLabels.length - 1]);
    const yMin: number = Number(yAxisLabels[0]);
    const yMax: number = Number(yAxisLabels[yAxisLabels.length - 1]);

    for (let value of cartesianValues) {
      const linePoints: CoordinatesModel[] = [];

      switch (value.type) {
        case CartesianElementTypeEnum.X_AXIS_LINE:
          linePoints.push(
            ...this.getElementXAxisLinePoints(value.points[0].x, drawableRect, xMin, xMax)
          );
          break;
        case CartesianElementTypeEnum.Y_AXIS_LINE:
          linePoints.push(
            ...this.getElementYAxisLinePoints(value.points[0].y, drawableRect, yMin, yMax)
          );
          break;
        default:
          for (const point of value.points) {
            linePoints.push({
              x: this.convertXValueToPixels(drawableRect, point.x, xMin, xMax),
              y: this.convertYValueToPixels(drawableRect, point.y, yMin, yMax)
            });
          }
      }

      linePoints.sort((a, b) => a.x - b.x);
      graphPoints.push({ ...value, points: linePoints });
    }

    return graphPoints;
  }

  private convertXValueToPixels(drawableRect: RectModel, value: number, minValue: number, maxValue: number): number {
    if (minValue === maxValue) {
      return drawableRect.left + drawableRect.width / 2;
    }
    return drawableRect.left + (drawableRect.width * (value - minValue) / (maxValue - minValue));
  }

  private convertYValueToPixels(drawableRect: RectModel, value: number, minValue: number, maxValue: number): number {
    if (minValue === maxValue) {
      return drawableRect.top + drawableRect.height / 2;
    }
    return drawableRect.top + drawableRect.height - (drawableRect.height * (value - minValue) / (maxValue - minValue));
  }

  private getElementXAxisLinePoints(xValue: number, drawableRect: RectModel, minValue: number, maxValue: number): CoordinatesModel[] {
    const x: number = this.convertXValueToPixels(drawableRect, xValue, minValue, maxValue);
    return [
      { x, y: drawableRect.top },
      { x, y: drawableRect.top + drawableRect.height }
    ];
  }

  private getElementYAxisLinePoints(yValue: number, drawableRect: RectModel, minValue: number, maxValue: number): CoordinatesModel[] {
    const y: number = this.convertYValueToPixels(drawableRect, yValue, minValue, maxValue);
    return [
      { x: drawableRect.left, y },
      { x: drawableRect.left + drawableRect.width, y }
    ];
  }

  private getLines(values: CartesianElementModel[]): LineModel[][] | null[] {
    const lines: LineModel[][] | null[] = new Array(values.length);

    for (let i = 0; i < values.length; i++) {
      if (values[i].points.length === 1) {
        lines[i] = null;
      } else {
        switch (values[i].type) {
          case CartesianElementTypeEnum.X_AXIS_LINE:
          case CartesianElementTypeEnum.Y_AXIS_LINE:
            lines[i] = [{ startPoint: values[i].points[0], endPoint: values[i].points[1] }];
            break;
          case CartesianElementTypeEnum.NO_INTERPOLATION:
            lines[i] = this.getNoInterpolationLines(values[i].points);
            break;
          case CartesianElementTypeEnum.CARDINAL_SPLINE:
            lines[i] = this.getCardinalSplineLines(values[i].points);
            break;
          case CartesianElementTypeEnum.ORDINARY_LEAST_SQUARES:
            lines[i] = [this.getOrdinaryLeastSquaresLine(values[i].points)];
            break;
          default:
            lines[i] = null;
        }
      }
    }

    return lines;
  }

  private getNoInterpolationLines(points: CoordinatesModel[]): LineModel[] {
    const lines: LineModel[] = [];

    for (let i = 1; i < points.length; i++) {
      lines.push({
        startPoint: points[i - 1],
        endPoint: points[i]
      });
    }

    return lines;
  }

  private getCardinalSplineLines(points: CoordinatesModel[]): LineModel[] {
    const coordinatesMatrix: number[][] = points.map(point => [point.x, point.y]);
    const flattenedCoordinates = ([] as number[]).concat(...coordinatesMatrix.map(flatten));
    const curvePoints: Float32Array = CardinalSpline.getCurvePoints(flattenedCoordinates, 0.5);
    const lines: LineModel[] = [];

    for (let i = 3; i < curvePoints.length; i += 2) {
      lines.push({
        startPoint: { x: curvePoints[i - 3], y: curvePoints[i - 2] },
        endPoint: { x: curvePoints[i - 1] , y: curvePoints[i] }
      });
    }

    return lines;
  }

  private getOrdinaryLeastSquaresLine(points: CoordinatesModel[]): LineModel {
    const xValues: number[] = points.map(point => point.x);
    const yValues: number[] = points.map(point => point.y);

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXSq = 0;
    var xvLength = xValues.length;

    for (let i = 0; i < xvLength; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumXSq += xValues[i] * xValues[i];
    }

    const m: number = ((sumXY - sumX * sumY / xvLength) / (sumXSq - sumX * sumX / xvLength));
    const b: number = sumY / xvLength - m * sumX / xvLength;

    return {
      startPoint: { x: xValues[0], y: m * xValues[0] + b },
      endPoint: { x: xValues[xvLength - 1], y: m * xValues[xvLength - 1] + b }
    };
  }

  private getDrawableArea(xAxisLine: LineModel, yAxisLine: LineModel): RectModel {
    return {
      top: yAxisLine.startPoint.y,
      right: xAxisLine.endPoint.x,
      bottom: yAxisLine.endPoint.y,
      left: xAxisLine.startPoint.x,
      width: xAxisLine.endPoint.x - xAxisLine.startPoint.x,
      height: yAxisLine.endPoint.y - yAxisLine.startPoint.y
    };
  }

  private getXCrosshair(positionX: number, drawableRect: RectModel): LineModel {
    return {
      startPoint: { x: positionX + drawableRect.left, y: drawableRect.top },
      endPoint: { x: positionX + drawableRect.left, y: drawableRect.top + drawableRect.height }
    };
  }

  private getYCrosshair(positionY: number, drawableRect: RectModel): LineModel {
    return {
      startPoint: { x: drawableRect.left, y: positionY + drawableRect.top },
      endPoint: { x: drawableRect.width + drawableRect.left, y: positionY + drawableRect.top }
    };
  }

  private getCrosshairXLabelPosition(ctx: CanvasRenderingContext2D, position: number, label: string, drawableRect: RectModel): CoordinatesModel {
    const textDimensions: DimensionModel = this.getTextDimensions(ctx, label);
    const x: number = position + drawableRect.left - textDimensions.width / 2;
    const y: number = drawableRect.top - 10;
    return { x, y };
  }

  private getCrosshairYLabelPosition(ctx: CanvasRenderingContext2D, position: number, label: string, drawableRect: RectModel): CoordinatesModel {
    const textDimensions: DimensionModel = this.getTextDimensions(ctx, label);
    const x: number = drawableRect.left + drawableRect.width + 10;
    const y: number = drawableRect.top + position + textDimensions.height / 2;
    return { x, y };
  }

  private getCrosshairLabel(position: number, axisLabels: string[], totalPxSize: number, precision: number): string {
    const min: number = Number(axisLabels[0]);
    const max: number = Number(axisLabels[axisLabels.length - 1]);
    const label: number = (position * (max - min) / totalPxSize) + min;
    return this.getRoundedValueString(label, precision);
  }

  private getTextDimensions(ctx: CanvasRenderingContext2D, text: string): DimensionModel {
    const metrics: TextMetrics = ctx.measureText(text);

    return {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }
  }

  private drawLines(ctx: CanvasRenderingContext2D, lines: LineModel[][] | null[], points: CartesianElementModel[]): void {
    if (lines.length === points.length) {
      for (let i = 0; i < lines.length; i++) {
        if (!points[i].isLineHidden) {
          const line: LineModel[] | null = lines[i];

          if (line !== null) {
            this.drawContinuousLine(ctx, points[i].color, points[i].width, points[i].opacity, points[i].dash, ...line);
          }
        }
      }
    }
  }

  private drawLineWithBreaks(ctx: CanvasRenderingContext2D, color: string, width: number, opacity: number, dash: [number, number] | null, values: LineModel[]): void {
    for (const value of values) {
      this.drawContinuousLine(ctx, color, width, opacity, dash, value);
    }
  }

  private drawXAxisLabels(ctx: CanvasRenderingContext2D, axisLabels: string[], xAxisValues: LineModel[], xAxisLine: LineModel): void {
    if (xAxisValues) {
      for (let i = 0; i < axisLabels.length; i++) {
        const text: string = axisLabels[i];
        const textDimensions: DimensionModel = this.getTextDimensions(ctx, text);

        this.drawText(ctx, {
          x: xAxisValues[i].startPoint.x - textDimensions.width / 2,
          y: xAxisLine.startPoint.y + textDimensions.height + 15
        }, text, this.axesColor, this.fontSizePx);
      }
    }
  }

  private drawYAxisLabels(ctx: CanvasRenderingContext2D, axisLabels: string[], yAxisValues: LineModel[], yAxisLine: LineModel): void {
    if (yAxisValues.length) {
      for (let i = 0; i < axisLabels.length; i++) {
        const text: string = axisLabels[i];
        const textDimensions: DimensionModel = this.getTextDimensions(ctx, text);

        this.drawText(ctx, {
          x: yAxisLine.startPoint.x - textDimensions.width - 15,
          y: yAxisValues[i].startPoint.y + textDimensions.height / 2
        }, text, this.axesColor, this.fontSizePx);
      }
    }
  }

  private drawText(ctx: CanvasRenderingContext2D, coordinates: CoordinatesModel, text: string, color: string, size: number, weight: number = 400): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Arial`;
    ctx.fillText(text, coordinates.x, coordinates.y);
  }

  private drawContinuousLine(ctx: CanvasRenderingContext2D, color?: string, width?: number, opacity?: number, dash?: [number, number] | null, ...line: LineModel[]): void {
    if (line.length) {
      ctx.beginPath();

      ctx.strokeStyle = color ?? '#000000';
      ctx.lineWidth = width ?? 1;
      ctx.globalAlpha = opacity ?? 1;
      ctx.setLineDash(dash ?? []);

      ctx.moveTo(line[0].startPoint.x, line[0].startPoint.y);
      ctx.lineTo(line[0].endPoint.x, line[0].endPoint.y);

      for (let i = 1; i < line.length; i++) {
        ctx.lineTo(line[i].endPoint.x, line[i].endPoint.y);
      }

      ctx.stroke();
    }
  }

  private drawPoints(ctx: CanvasRenderingContext2D, elements: CartesianElementModel[]): void {
    const endAngle: number = 2 * Math.PI;

    for (const element of elements) {
      if (!element.areDotsHidden) {
        for (const point of element.points) {
          this.drawDot(ctx, {
            position: point,
            radius: this.pointRadius,
            color: element.color,
            opacity: element.opacity,
            startAngle: 0,
            endAngle
          });
        }
      }
    }
  }

  private drawDot(ctx: CanvasRenderingContext2D, dot: DotModel): void {
    ctx.beginPath();
    ctx.arc(dot.position.x, dot.position.y, dot.radius, dot.startAngle, dot.endAngle);
    ctx.fillStyle = dot.color ?? '#000000';
    ctx.globalAlpha = dot.opacity ?? 1;
    ctx.closePath();
    ctx.fill();
  }

  public onCursorPositionChange(event: PointerPositionModel | undefined): void {
    if (this.isCrosshairEnabled && this.canvas && this.ctx && this.cache && this.isReady && this.cartesianValues?.length) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
      this.draw(this.ctx, this.cache);

      if (event) {
        const xCrosshair: LineModel = this.getXCrosshair(event.x, this.cache.drawableRect);
        const yCrosshair: LineModel = this.getYCrosshair(event.y, this.cache.drawableRect);
        const xCrosshairLabel: string = event.xDot ? this.getRoundedValueString(event.xDot, this.xCrosshairLabelPrecision) :
          this.getCrosshairLabel((event.xDot ?? event.x), this.cache.xAxisLabels, this.cache.drawableRect.width, this.xCrosshairLabelPrecision);
        const yCrosshairLabel: string = event.yDot ? this.getRoundedValueString(event.yDot, this.yCrosshairLabelPrecision) :
        this.getCrosshairLabel(this.cache.drawableRect.height - event.y, this.cache.yAxisLabels, this.cache.drawableRect.height, this.yCrosshairLabelPrecision);
        const xCrosshairLabelPosition: CoordinatesModel = this.getCrosshairXLabelPosition(this.ctx, event.x, xCrosshairLabel, this.cache.drawableRect);
        const yCrosshairLabelPosition: CoordinatesModel = this.getCrosshairYLabelPosition(this.ctx, event.y, yCrosshairLabel, this.cache.drawableRect);
        this.drawContinuousLine(this.ctx, this.crosshairColor, this.crosshairWidth, 1, null, xCrosshair);
        this.drawContinuousLine(this.ctx, this.crosshairColor, this.crosshairWidth, 1, null, yCrosshair);
        const crosshairTextColor: string = event.isDot ? (event.dotColor ?? '#000000') : this.crosshairColor;
        const crosshairFontWeight: number = event.isDot ? 600 : 400;
        this.drawText(this.ctx, xCrosshairLabelPosition, xCrosshairLabel, crosshairTextColor, this.fontSizePx, crosshairFontWeight);
        this.drawText(this.ctx, yCrosshairLabelPosition, yCrosshairLabel, crosshairTextColor, this.fontSizePx, crosshairFontWeight);
      }
    }
  }

  private getRoundedValueString(value: number, rounding: number = 2): string {
    return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(rounding);
  }
}
