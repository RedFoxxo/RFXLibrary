import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  RfxLoggerComponent,
  HomeComponent,
  RfxParallaxComponent,
  RfxScrollAnimationComponent
} from './_components';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'rfx-logger', component: RfxLoggerComponent },
  { path: 'rfx-parallax', component: RfxParallaxComponent },
  { path: 'rfx-scroll-animation', component: RfxScrollAnimationComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
