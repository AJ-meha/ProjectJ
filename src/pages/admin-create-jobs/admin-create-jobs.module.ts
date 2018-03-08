import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminCreateJobsPage } from './admin-create-jobs';

@NgModule({
  declarations: [
    AdminCreateJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminCreateJobsPage),
  ],
})
export class AdminCreateJobsPageModule {}
