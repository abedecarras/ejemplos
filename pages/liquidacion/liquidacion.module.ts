import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiquidacionPage } from './liquidacion';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LiquidacionPage,
  ],
  imports: [
    IonicPageModule.forChild(LiquidacionPage),
    PipesModule
  ],
})
export class LiquidacionPageModule {}
