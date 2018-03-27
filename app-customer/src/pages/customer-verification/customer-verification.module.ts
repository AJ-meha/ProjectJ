import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerVerificationPage } from './customer-verification';

@NgModule({
  declarations: [
    CustomerVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerVerificationPage),
  ],
})
export class CustomerVerificationPageModule {}
