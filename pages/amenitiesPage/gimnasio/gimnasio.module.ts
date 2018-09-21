import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GimnasioPage } from './gimnasio';

@NgModule({
  declarations: [
    GimnasioPage,
  ],
  imports: [
    IonicPageModule.forChild(GimnasioPage),
  ],
})
export class GimnasioPageModule {}
