import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SumPage } from './sum';

@NgModule({
  declarations: [
    SumPage,
  ],
  imports: [
    IonicPageModule.forChild(SumPage),
  ],
})
export class SumPageModule {}
