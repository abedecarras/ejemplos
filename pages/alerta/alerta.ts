import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-alerta',
  templateUrl: 'alerta.html',
})
export class AlertaPage {
  msj:string;
  isError:boolean;
  returnToRoot:boolean;
  returnToPage:string;
  params:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private view:ViewController) {
    this.msj = navParams.get('msj');
    this.isError = navParams.get('isError') || false;
    this.returnToRoot = navParams.get('returnToRoot') || false;
    this.returnToPage = navParams.get('returnToPage') || '';
    this.params = navParams.get('params') || {};
    if (this.returnToRoot) {
      this.navCtrl.remove(1, this.navCtrl.getActive().index);
    }
  }

  close() {
    if (this.returnToPage != '') {
      this.navCtrl.push(this.returnToPage, this.params, {animate: true, direction: 'back'});
    }
    this.view.dismiss();
  }

}
