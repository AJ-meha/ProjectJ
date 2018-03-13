import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleJobPage } from './single-job';

@NgModule({
  declarations: [
    SingleJobPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleJobPage),
  ],
  exports: [
    SingleJobPage
  ]
})
export class SingleJobPageModule {}
