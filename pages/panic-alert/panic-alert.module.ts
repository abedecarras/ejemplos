import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PanicAlertPage } from './panic-alert';

@NgModule({
  declarations: [
    PanicAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(PanicAlertPage),
  ],
})
export class PanicAlertPageModule {}
