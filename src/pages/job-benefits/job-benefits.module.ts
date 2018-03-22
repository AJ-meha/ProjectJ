import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobBenefitsPage } from './job-benefits';

@NgModule({
  declarations: [
    JobBenefitsPage,
  ],
  imports: [
    IonicPageModule.forChild(JobBenefitsPage),
  ],
})
export class JobBenefitsPageModule {}
