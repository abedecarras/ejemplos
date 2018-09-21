import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Nav, MenuController, ModalController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Utils } from '../../providers/utilsExpensas';
import { MenuPage } from '../menu/menu';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

import * as anime from 'animejs';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  @ViewChild(Nav) nav: Nav;

  static lastInstance: HomePage;

  isAdmin: boolean;
  hasFacebookID: boolean;
  panicAnimation: anime;
  pages: Array<{ title: string, component: any }>;
  userName: string;
  avatarURL: string;
  show = false;
  news: Array<{tipo: string, titulo: string, id: number}>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public menu: MenuController,
              private facebook: Facebook,
              private callNmb: CallNumber,
              private geolocation: Geolocation,
              private loading: Loading,
              public modalCtrl: ModalController,
              private diagnostic: Diagnostic,
              public services: Services) {
    HomePage.lastInstance = this;
    this.loading.present();
    this.services.getUserData(this.userDataCallback);
    this.updateAvatar();
    this.pages = new Array();
    this.news = new Array();
    this.hasFacebookID = false;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.CALL_PHONE).then((status) => {
        if (status != this.diagnostic.permissionStatus.GRANTED && status != this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
          this.diagnostic.requestRuntimePermission(this.diagnostic.permission.CALL_PHONE);
        }
      }).catch((error) => {});
    }).catch((error) => {});
  }

  private userDataCallback(response) {
    var li: HomePage = HomePage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.hasFacebookID = response.Data.DATOS_PERSONA[0].TIENE_ID_FACEBOOK;
    li.avatarURL = response.Data.DATOS_PERSONA[0].URL_AVATAR;
    li.userName = response.Data.DATOS_PERSONA[0].NOMBRE + ' ' + response.Data.DATOS_PERSONA[0].APELLIDO;
    if (typeof response.Data.UNIDADES_FUNCIONALES !== 'undefined') {
      li.isAdmin = false;
      li.loading.present();
      li.services.getNews(response.Data.UNIDADES_FUNCIONALES[0].ConsorcioId, li.getNewsCallback);
    } else if(typeof response.Data.CONSORCIOS !== 'undefined') {
      li.isAdmin = true;
      li.loading.present();
      li.services.getNews(response.Data.CONSORCIOS[0].ID, li.getNewsCallback);
    }

    li.loading.dismiss();
    if (li.pages.length > 0) {
      return;
    }
    var permisos = response.Data.PERMISOS;
    for (var i = 0; i < permisos.length; ++i) {
      if (permisos[i].VISIBLE_EN_MENU) {
        switch (permisos[i].CODIGO) {
          case "MIS_EXPENSAS":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'mis expensas', component:'EstadoDeCuentaPage' });
            break;
          case "APP_RECLAMOS":
          if(li.isAdmin) {
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'pedidos y sugerencias', component:'ReclamoConsorcioPage' });
          } else {
            var consorcios = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
            if (consorcios.length == 1) {
              li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'pedidos y sugerencias', component:'PedidosYSugerenciasPage' });
            } else {
              li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'pedidos y sugerencias', component:'ReclamoConsorcioPage' });
            }
          }
            break;
          case "APP_NOVEDADES":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'novedades', component:'NovedadesPage' });
            break;
          case "APP_INF_PAGO":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'informar pago', component:'EnviarComprobantePage' });
            break;
          case "APP_PRESUPUESTOS":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'presupuestos', component:'PresupuestosPage' });
            break;
          case "APP_AMENITIES":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'reserva de amenities', component:'AmenitiesPage' });
            break;
          case "APP_CLASIFICADOS":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'clasificados', component:'ClasificadosPage' });
            break;
          case "APP_TEL_UTIL":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'teléfonos útiles', component:'TelefonosDeUtilidadPage' });
            break;
          case "APP_CHAT":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'chat', component:'ChatPage' });
            break;
          case "APP_REG_PAGO":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'registrar cobro', component:'EnviarComprobantePage' });
            break;
          case "APP_VOTAR":
            break;
          case "APP_VENCIMIENTOS":
            li.pages.splice(permisos[i].ORDEN_VISUALIZACION, 0, { title: 'calendario', component:'VencimientosPage' });
            break;
        }
      }
    }

    MenuPage.lastInstance.pages = li.pages;
  }

  public getNewsCallback(response) {
    var li: HomePage = HomePage.lastInstance;
    li.news = [];
    if (li.hasFacebookID == false) {
      li.news.push({
        'id': -999,
        'tipo': 'facebook',
        'titulo': 'Conectá tu facebook',
      });
    }
    if (response.Data.lenght == 1) {
      li.news.push({
        'id': response.Data[0].id,
        'tipo': 'single',
        'titulo': response.Data[0].titulo
      });
    } else {
      li.news.push({
        'id': response.Data.lenght,
        'tipo': 'multiple',
        'titulo': 'Tienes notificaciones importantes',
      });
    }
    li.loading.dismiss();
  }

  goToPage(name) {
    this.navCtrl.push(name);
  }

  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.push(page.component);
  }

  panicButtonStart(event) {
    console.log('panicButtonStart');
    var li: HomePage = HomePage.lastInstance;
    this.panicAnimation = anime({
      targets: '#CSStransforms .btn',
      scale: 10,
      duration: 2000,
      easing: 'easeInExpo',
      complete: function(anim) {
        let modal = li.modalCtrl.create('PanicAlertPage');
        modal.present();
        li.panicButtonEnd();
        li.callNmb.callNumber('911', true)
          .then(() => {})
          .catch((err) => {
            li.navCtrl.push('AlertaPage', {
              msj: err,
              isError: true
            });
          });
      }
    });
  }

  panicButtonEnd() {
    var li: HomePage = HomePage.lastInstance;
    li.panicAnimation.pause();
    anime({
      targets: '#CSStransforms .btn',
      scale: 1,
      // duration: 1000,
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      li.services.sendPanicAlert(resp.coords.latitude, resp.coords.longitude, function(){});
    }).catch((error) => {
      li.navCtrl.push('AlertaPage', {
        msj: 'Error al obtener la Geolocalización',
        isError: true
      });
    });
  }

  popup() {
    let alert = this.alertCtrl.create({
      title: 'Atención!',
      subTitle: 'Mantené apretado durante 5 segundos',
      buttons: ['ACEPTAR']
    });
    alert.present();
  }

  logOut() {
    this.services.logout();
    this.navCtrl.setRoot('LoginPage');
  }

  close() {
    this.news.shift();
  }

  showMood() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  showAlert() {
    let modal = this.modalCtrl.create('PanicAlertPage');
    modal.present();
  }

  private updateAvatar() {
    this.facebook.getLoginStatus()
      .then((response: FacebookLoginResponse) => {
        if (response.status == 'connected') {
          this.facebook.api('me?fields=id,email,picture', []).then(profile => {
            var userData = {id: profile['id'], email: profile['email'], picture: profile['picture']['data']['url'], accessToken: response.authResponse.accessToken};
            this.services.updateAvatar(userData.picture, function(response) {});
          })
        }
      })
      .catch(error => {});
  }

  goNews() {
    if (this.news[0].tipo == 'facebook') {
      this.facebook.login(['email', 'public_profile'])
      .then((response: FacebookLoginResponse) => {
        this.facebook.api('me?fields=id,email,picture', []).then(profile => {
            var userData = {id: profile['id'], email: profile['email'], picture: profile['picture']['data']['url'], accessToken: response.authResponse.accessToken};
            this.services.updateAvatar(userData.picture, function(response) {});
            this.services.asociarIdFacebook(userData.id, this.lgFbCallback);
        })
      })
      .catch(error => {
        this.navCtrl.push('AlertaPage',{
          msj: 'Error al conectar a Facebook',
          isError: true
        });
      });
      return;
    }

    if (this.news[0].tipo == 'single') {
      this.navCtrl.push('NovedadesPage');
      return;
    }

    if (this.news[0].tipo == 'multiple') {
      this.navCtrl.push('NovedadesPage');
      return;
    }
  }

  lgFbCallback(response) {
    if (response.Success) {
      HomePage.lastInstance.news.shift();
    } else {
      HomePage.lastInstance.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
      });
    }
  }
}
