import { Component, Input } from '@angular/core';
import { CartesianElementModel } from '../../models';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.less']
})
export class LegendComponent {
  @Input()
  public cartesianValues: CartesianElementModel[];

  @Input()
  public fontFamily: string;

  constructor() {
    this.fontFamily = 'Arial';
    this.cartesianValues = [];
  }
}
