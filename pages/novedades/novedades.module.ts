import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovedadesPage } from './novedades';

@NgModule({
  declarations: [
    NovedadesPage,
  ],
  imports: [
    IonicPageModule.forChild(NovedadesPage),
  ],
})
export class NovedadesPageModule {}
