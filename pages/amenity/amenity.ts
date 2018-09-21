import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-amenity',
  templateUrl: 'amenity.html',
})
export class AmenityPage {

  amenity: string;

  constructor(public nav: NavController, public navCtrl: NavController, public navParams: NavParams) {
    this.amenity = this.navParams.get('amenity');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AmenityPage');
  }

  goHome() {
    this.nav.popToRoot();
  }

}
