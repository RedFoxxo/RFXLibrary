import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LegendComponent } from './components/legend/legend.component';
import { CartesianGraphComponent } from './components/cartesian-graph/cartesian-graph.component';
import { PointerPositionDirective } from './directives/pointer-position.directive';

@NgModule({
  declarations: [
    CartesianGraphComponent,
    LegendComponent,
    PointerPositionDirective
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CartesianGraphComponent
  ]
})
export class RfxCartesianChartModule { }
