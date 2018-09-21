import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearUsuarioPage } from './crear-usuario';

@NgModule({
  declarations: [
    CrearUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearUsuarioPage),
  ],
})
export class CrearUsuarioPageModule {}
