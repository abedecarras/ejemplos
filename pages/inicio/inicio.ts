import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Services } from '../../providers/services';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  static lastInstance: InicioPage;

  userData = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private facebook: Facebook,
              private screenOrientation: ScreenOrientation,
              public services: Services,
              private storage: Storage) {
    InicioPage.lastInstance = this;
  }

  ionViewDidLoad() {
    this.screenOrientation.lock('portrait');  // DESCOMENTAR PARA QUE NO TIRE ERROR CUANDO PRUEBO EN EL BROW
  }

  goLogin() {
    this.navCtrl.push('LoginPage');
  }

  goCrearUsuario() {
    this.navCtrl.push('CrearUsuarioPage');
  }

  lgFbCallback(logged) {
    if (logged)
      InicioPage.lastInstance.navCtrl.setRoot('MenuPage');
    else {
      InicioPage.lastInstance.navCtrl.push('AlertaPage',{
        msj: 'Error al conectar a Facebook',
        isError: true
      });
    }
  }

  loginWithFB(){
    this.facebook.login(['email', 'public_profile'])
      .then((response: FacebookLoginResponse) => {
        this.facebook.api('me?fields=id,email,picture', []).then(profile => {
            this.userData = {id: profile['id'], email: profile['email'], picture: profile['picture']['data']['url'], accessToken: response.authResponse.accessToken};
            this.services.requestLoginFb(this.userData.id, this.userData.email, this.userData.accessToken, this.lgFbCallback);
        })
      })
      .catch(error => {
        this.navCtrl.push('AlertaPage',{
          msj: 'Error al conectar a Facebook',
          isError: true
        });
      });
  }

  ngOnInit() {
    this.storage.get('token').then((val) => {
      if (val) {
        InicioPage.lastInstance.navCtrl.setRoot('MenuPage');
      }
    });
  }
}
