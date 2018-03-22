import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminListJobsPage } from './admin-list-jobs';

@NgModule({
  declarations: [
    AdminListJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminListJobsPage),
  ],
})
export class AdminListJobsPageModule {}
