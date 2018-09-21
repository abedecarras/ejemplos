import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-pedidos-y-sugerencias',
  templateUrl: 'pedidos-y-sugerencias.html',
})
export class PedidosYSugerenciasPage {

  static lastInstance: PedidosYSugerenciasPage;
  periodo: number;
  months: Array<string>;
  isAdmin: boolean;
  idConsorcio: number;

  constructor(public navCtrl: NavController,
              public nav:NavController,
              public navParams: NavParams,
              public loading: Loading,
              public services: Services) {

    PedidosYSugerenciasPage.lastInstance = this;
    this.loading.present();
    this.idConsorcio = this.navParams.get('idConsorcio');
    this.periodo = this.navParams.get('periodo');
    if (typeof this.periodo === 'undefined') {
      this.periodo = (new Date()).getFullYear();
    }
    this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: PedidosYSugerenciasPage = PedidosYSugerenciasPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    if (typeof response.Data.UNIDADES_FUNCIONALES !== 'undefined') {
      li.isAdmin = false;
      li.idConsorcio = response.Data.UNIDADES_FUNCIONALES[0].ConsorcioId;
    } else if(typeof response.Data.CONSORCIOS !== 'undefined') {
      li.isAdmin = true;
    }
    li.getClaims();
    li.loading.dismiss();
  }

  private getClaims() {
    this.loading.present();
    this.services.getClaims(this.idConsorcio, 0, 0, this.periodo, this.getClaimsCallback);
  }

  private getClaimsCallback(response) {
    var li: PedidosYSugerenciasPage = PedidosYSugerenciasPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.months = Utils.getInstance().getMonthsFromClaimsList(response.Data);
    li.loading.dismiss();
  }

  goMonth(m) {
    this.navCtrl.push('PedidosRealizadosPage', {
      'month': m,
      'year': this.periodo,
      'idConsorcio': this.idConsorcio
    });
  }

  goYear() {
    this.navCtrl.push('ReclamosPeriodoPage', {'idConsorcio': this.idConsorcio});
  }

  goGenerarTicket() {
    this.navCtrl.push('ReclamosPage');
  }

  goHome() {
    this.nav.popToRoot();
  }

}
