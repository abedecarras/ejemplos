import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-reclamos-periodo',
  templateUrl: 'reclamos-periodo.html',
})
export class ReclamosPeriodoPage {

  static lastInstance: ReclamosPeriodoPage;
  years: Array<string>;
  // isAdmin: boolean;
  idConsorcio: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loading: Loading, public services: Services) {
    ReclamosPeriodoPage.lastInstance = this;
    this.loading.present();
    this.idConsorcio = this.navParams.get('idConsorcio');
    this.services.getClaims(this.idConsorcio, 0, 0, 0, this.getClaimsCallback);
  }

  private getClaimsCallback(response) {
    var li: ReclamosPeriodoPage = ReclamosPeriodoPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.years = Utils.getInstance().getYearsFromClaimsList(response.Data);
    li.loading.dismiss();
  }

  goPeriodo(y) {
    this.navCtrl.push('PedidosYSugerenciasPage',
    {'periodo': y, 'idConsorcio': this.idConsorcio});
  }
}
