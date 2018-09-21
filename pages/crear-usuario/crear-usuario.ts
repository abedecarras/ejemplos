import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-crear-usuario',
  templateUrl: 'crear-usuario.html',
})
export class CrearUsuarioPage {

  public type = 'password';
  public showPass = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrearUsuarioPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  showPassword() {
    this.showPass = !this.showPass;

    if(this.showPass){
      this.type = 'text';
    } else {
      // this.buttonColorPassword = 'rgb(255, 255, 255)';
      this.type = 'password';
    }
  }


}
