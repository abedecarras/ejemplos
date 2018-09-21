import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmenitiesPage } from './amenities';

@NgModule({
  declarations: [
    AmenitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(AmenitiesPage),
  ],
})
export class AmenitiesPageModule {}
