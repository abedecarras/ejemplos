import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PresupuestosPage } from './presupuestos';

@NgModule({
  declarations: [
    PresupuestosPage,
  ],
  imports: [
    IonicPageModule.forChild(PresupuestosPage),
  ],
})
export class PresupuestosPageModule {}
