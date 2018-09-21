import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmenityPage } from './amenity';

@NgModule({
  declarations: [
    AmenityPage,
  ],
  imports: [
    IonicPageModule.forChild(AmenityPage),
  ],
})
export class AmenityPageModule {}
