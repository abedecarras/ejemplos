import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnviarComprobantePage } from './enviar-comprobante';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    EnviarComprobantePage,
  ],
  imports: [
    IonicPageModule.forChild(EnviarComprobantePage),
    PipesModule
  ],
})
export class EnviarComprobantePageModule {}
