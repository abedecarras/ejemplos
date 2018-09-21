import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidosYSugerenciasPage } from './pedidos-y-sugerencias';

@NgModule({
  declarations: [
    PedidosYSugerenciasPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidosYSugerenciasPage),
  ],
})
export class PedidosYSugerenciasPageModule {}
