import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-panic-alert',
  templateUrl: 'panic-alert.html',
})
export class PanicAlertPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  }

  closeModal() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PanicAlertPage');
  }

}
