import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminRegisterPage } from './admin-register';

@NgModule({
  declarations: [
    AdminRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminRegisterPage),
  ],
})
export class AdminRegisterPageModule {}
