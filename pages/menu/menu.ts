import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Nav } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Badge } from '@ionic-native/badge';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  static lastInstance: MenuPage;

  rootPage = 'HomePage';

  @ViewChild(Nav) nav: Nav;

  pages: Array<{ title: string, component: any }>;
  userName: string;
  avatarURL: string;
  badgeNumber: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menu: MenuController,
              private badge: Badge,
              public services: Services) {

    MenuPage.lastInstance = this;
    this.services.getUserData(this.userDataCallback);
    this.pages = new Array();
    this.badgeNumber = 4;
    this.badge.set(this.badgeNumber);
  }

  private userDataCallback(response) {
    var li: MenuPage = MenuPage.lastInstance;
    if (response.Success == false) {
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.userName = response.Data.DATOS_PERSONA[0].NOMBRE + ' ' + response.Data.DATOS_PERSONA[0].APELLIDO;
    li.avatarURL = response.Data.DATOS_PERSONA[0].URL_AVATAR;
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
  }

  async openNovedad(page) {
    try {
      this.badgeNumber = 0;
      this.menu.close();
      this.nav.push(page.component);
      let badge = await this.badge.clear();
      console.log(this.badgeNumber);
      console.log(badge);
    }
    catch(e){
      console.log(e);
    }
  }

  logOut() {
    this.services.logout();
    this.navCtrl.setRoot('InicioPage');
  }

}
