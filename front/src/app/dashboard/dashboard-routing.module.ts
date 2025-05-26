import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    data: { title: 'Default Dashboard' }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // 기본 경로로 리다이렉트
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
