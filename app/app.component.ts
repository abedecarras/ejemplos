import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Nav } from 'ionic-angular';
import { Loading } from '../providers/loading';

// declare var testvar;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  public rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              keyboard: Keyboard,
              events: Events,
              public loading: Loading,
              private storage: Storage
  ) {
      // alert(testvar);
      platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.storage.get('token').then((val) => {
        if (val) {
          // this.nav.push('MenuPage').then(()=>{
            this.nav.setRoot('MenuPage');
          // });
        } else {
            this.nav.setRoot('InicioPage');
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
      // keyboard.disableScroll(true);
    });

    events.subscribe('user:logout', () => {
      console.log('user:logout');
      this.nav.setRoot('InicioPage');
      this.storage.remove('token');
      this.loading.dismissAll();
    });

    events.subscribe('user:login', (token) => {
      console.log('user:login');
      this.storage.set('token', token);
    });
  }
}
