import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ModalController } from 'ionic-angular';
// import { Keyboard } from '@ionic-native/keyboard';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  @ViewChild(Content) content: Content;
  @ViewChild('username') uname;
  @ViewChild('password') password;

  static lastInstance: LoginPage;

  public type = 'password';
  public showPass = false;

  // buttonColor: string = 'rgb(26, 179, 78)';
  buttonColorPassword: string = 'rgb(255, 255, 255)';
  userData = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public loading: Loading,
              public services: Services,
              private storage: Storage
             ) {
              LoginPage.lastInstance = this;
  }

  goBack() {
    this.navCtrl.pop();
  }

  showPassword() {
    this.showPass = !this.showPass;

    if(this.showPass){
      this.type = 'text';
    } else {
      this.buttonColorPassword = 'rgb(255, 255, 255)';
      this.type = 'password';
    }
  }

  loggedResponse(logged, errorTitle, errorSubtitle) {
    if (logged)
      LoginPage.lastInstance.navCtrl.setRoot('MenuPage');
    else {
      this.showError('El usuario o la contraseña son incorrectos');
    }
  }

  lgCallback(logged) {
    LoginPage.lastInstance.loggedResponse(logged, 'Datos erróneos!', 'Usuario o Contraseña incorrectos!');
    LoginPage.lastInstance.loading.dismiss();
  }

  login(){
    this.loading.present();
    // this.buttonColor = 'rgb(26, 179, 78)'; //desired Color
    this.services.requestLogin(this.uname.value, this.password.value, this.lgCallback);
  }

  goPassword() {
    // this.buttonColorPassword = 'rgb(255, 255, 255)';
    this.navCtrl.push('PasswordPage');
  }

  showError(error) {
    this.navCtrl.push('AlertaPage',{
      msj: error,
      isError: true
    });
  }

  showMood() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  ngOnInit() {
    this.storage.get('token').then((val) => {
      if (val) {
        LoginPage.lastInstance.navCtrl.setRoot('MenuPage');
      }
    });
  }
}
