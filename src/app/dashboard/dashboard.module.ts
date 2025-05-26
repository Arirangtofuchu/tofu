import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DefaultComponent } from './default/default.component'; // DefaultComponent만 남김

@NgModule({
  declarations: [
    DefaultComponent // AlternateComponent 제거
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule
  ]
})
export class DashboardModule { }
