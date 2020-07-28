import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  RfxLoggerComponent,
  HomeComponent
} from './_components';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'rfx-logger', component: RfxLoggerComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
