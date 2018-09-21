import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidosRealizadosPage } from './pedidos-realizados';

@NgModule({
  declarations: [
    PedidosRealizadosPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidosRealizadosPage),
  ],
})
export class PedidosRealizadosPageModule {}
