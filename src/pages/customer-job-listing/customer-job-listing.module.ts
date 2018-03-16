import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerJobListingPage } from './customer-job-listing';

@NgModule({
  declarations: [
    CustomerJobListingPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerJobListingPage),
  ],
})
export class CustomerJobListingPageModule {}
