import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerLoginPage } from './customer-login';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustomerLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerLoginPage),
    TranslateModule.forChild(),
  ],
})
export class CustomerLoginPageModule {}
