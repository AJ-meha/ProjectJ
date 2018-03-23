import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCreateJobsPage } from './admin-create-jobs';

const routes: Routes = [
  { path: '', component: AdminCreateJobsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCreateJobsRoutingModule { }