import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Utils } from '../../providers/utilsExpensas';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-liquidacion',
  templateUrl: 'liquidacion.html',
})

export class LiquidacionPage {


  downloadUrl: string;

  balanceDate: string;
  balanceCash: string;
  balancePaid: string;
  balanceExpiration: string;

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser ) {

    this.downloadUrl = navParams.get('summary').URL_REPORTE;
    this.balanceCash = navParams.get('summary').SaldoAPagar;
    this.balanceExpiration = Utils.getInstance().formatDate(navParams.get('summary').Vencimiento1);
    this.balanceDate = navParams.get('summary').FechaDesde;
  }

  goHome() {
    this.nav.popToRoot();
  }

  download() {
    let options : InAppBrowserOptions = {
        location : 'yes',
    };
    this.iab.create(this.downloadUrl, '_system', options);
  }

  sendWhatsapp() {
   this.socialSharing.shareViaWhatsApp(null, null, this.downloadUrl);
  }

  sendEmail() {
   this.socialSharing.shareViaEmail(this.downloadUrl, 'Expensas', null, null, null, null);
  }
}
