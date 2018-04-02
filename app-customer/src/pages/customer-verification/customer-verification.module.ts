import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerVerificationPage } from './customer-verification';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustomerVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerVerificationPage),
    TranslateModule.forChild(),
  ],
})
export class CustomerLoginPageModule {}
