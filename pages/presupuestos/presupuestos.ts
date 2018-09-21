import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-presupuestos',
  templateUrl: 'presupuestos.html',
})
export class PresupuestosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresupuestosPage');
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

  goPresupuesto1() {
    this.navCtrl.push('Presupuesto1Page');
  }

}
