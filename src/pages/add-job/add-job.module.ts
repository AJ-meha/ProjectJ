import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddJobPage } from '../add-job/add-job';

@NgModule({
  declarations: [
    AddJobPage,
  ],
  imports: [
    IonicPageModule.forChild(AddJobPage),
  ],
  exports: [
    AddJobPage
  ]
})
export class AddJobPageModule {}
