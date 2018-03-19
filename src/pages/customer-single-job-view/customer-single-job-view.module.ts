import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSingleJobViewPage } from './customer-single-job-view';

@NgModule({
  declarations: [
    CustomerSingleJobViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSingleJobViewPage),
  ],
})
export class CustomerSingleJobViewPageModule {}
