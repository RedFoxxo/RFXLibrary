import { Component, OnInit } from '@angular/core';
import {
  CartesianElementModel,
  CartesianElementTypeEnum,
} from 'rfx-cartesian-chart';

@Component({
  selector: 'app-rfx-cartesian-chart',
  templateUrl: './rfx-cartesian-chart.component.html',
  styleUrls: ['./rfx-cartesian-chart.component.less'],
})
export class RfxCartesianChartComponent implements OnInit {
  public data: CartesianElementModel[];

  constructor() {
    this.data = [
      {
        name: 'Minimum threshold',
        color: '#FF3D00',
        opacity: 0.8,
        type: 2,
        points: [
          {
            x: 0,
            y: -1,
          },
        ],
        dash: [5, 5],
        areDotsHidden: true,
      },
      {
        name: 'Maximum threshold',
        color: '#FF3D00',
        opacity: 0.8,
        type: 2,
        points: [
          {
            x: 0,
            y: 1,
          },
        ],
        dash: [5, 5],
        areDotsHidden: true,
      },
      {
        name: 'Data',
        color: '#13ACDC',
        type: 4,
        points: [
          { x: 5, y: 0.5 },
          // { x: 2, y: 0.04918032786885246 },
          // { x: 3, y: 0.04918032786885246 },
          // { x: 4, y: 0.04918032786885246 },
          // { x: 5, y: 0.00029757931465713793 },
          // { x: 6, y: -0.6847173694991879 },
          // { x: 7, y: -0.668419149619158 },
          // { x: 8, y: -111.7936128502813 },
          // { x: 9, y: -111.80028541625344 },
          // { x: 10, y: -111.79914640370073 },
          // { x: 11, y: -111.79444117458097 },
          // { x: 12, y: -111.78681434034927 },
        ],
      },
    ];
  }

  ngOnInit(): void {}
}
