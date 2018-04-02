import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerLanguagePage } from './customer-language';

@NgModule({
  declarations: [
    CustomerLanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerLanguagePage),
  ],
})
export class CustomerLanguagePageModule {}
