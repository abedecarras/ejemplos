import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PiletaPage } from './pileta';

@NgModule({
  declarations: [
    PiletaPage,
  ],
  imports: [
    IonicPageModule.forChild(PiletaPage),
  ],
})
export class PiletaPageModule {}
