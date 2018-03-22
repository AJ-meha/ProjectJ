import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerDashboardPage } from './customer-dashboard';

@NgModule({
  declarations: [
    CustomerDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerDashboardPage),
  ],
})
export class CustomerDashboardPageModule {}
