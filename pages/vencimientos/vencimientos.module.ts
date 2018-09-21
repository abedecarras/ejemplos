import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VencimientosPage } from './vencimientos';

@NgModule({
  declarations: [
    VencimientosPage,
  ],
  imports: [
    IonicPageModule.forChild(VencimientosPage),
  ],
})
export class VencimientosPageModule {}
