import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
// import * as anime from 'animejs';


@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {

  buttonColor: string = 'rgb(26, 179, 78)';
  email: string;
  static lastInstance: PasswordPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loading: Loading,
              private services: Services) {
    this.email = '';
    PasswordPage.lastInstance = this;
  }

  resetPasswordCallback(response) {
    var li: PasswordPage = PasswordPage.lastInstance;
    let success = response.Success;
    if (typeof success !== 'undefined' && success){
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || 'Contraseña cambiada',
        isError: false
      });
    } else {
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true
      });
    }
    li.loading.dismiss();
  }

  resetPassword() {
    this.loading.present();
    this.services.resetPassword(this.email, this.resetPasswordCallback);
  }

  goBack() {
    this.navCtrl.setRoot('LoginPage');
  }

}
