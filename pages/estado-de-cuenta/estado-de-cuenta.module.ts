import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstadoDeCuentaPage } from './estado-de-cuenta';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    EstadoDeCuentaPage,
  ],
  imports: [
    IonicPageModule.forChild(EstadoDeCuentaPage),
    PipesModule
  ],
})
export class EstadoDeCuentaPageModule {}
