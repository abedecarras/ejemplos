import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-ver-reserva',
  templateUrl: 'ver-reserva.html',
})
export class VerReservaPage {

  telefono:string='011 70212323';
  amenity:string;

  constructor(public nav:NavController, public navCtrl: NavController, public navParams: NavParams) {
    this.amenity = this.navParams.get('amenity');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerReservaPage');
  }

  goHome() {
    this.nav.popToRoot();
  }

}
