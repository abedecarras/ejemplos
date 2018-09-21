import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuinchoPage } from './quincho';

@NgModule({
  declarations: [
    QuinchoPage,
  ],
  imports: [
    IonicPageModule.forChild(QuinchoPage),
  ],
})
export class QuinchoPageModule {}
