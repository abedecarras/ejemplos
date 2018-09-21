import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Loading } from '../../providers/loading';
import { Services } from '../../providers/services';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-reclamo-consorcio',
  templateUrl: 'reclamo-consorcio.html',
})
export class ReclamoConsorcioPage {

  static lastInstance: ReclamoConsorcioPage;

  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  partnershipSelected: number;
  isNeighbor: boolean;

  constructor(public navCtrl: NavController,
              public nav:NavController,
              public navParams: NavParams,
              public loading: Loading,
              public services: Services) {
    ReclamoConsorcioPage.lastInstance = this;
    this.loading.present();
    this.partnershipsList = new Array();
    this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: ReclamoConsorcioPage = ReclamoConsorcioPage.lastInstance;
    li.loading.dismiss();
    if (response.Success == false) {
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    if (typeof response.Data.UNIDADES_FUNCIONALES !== 'undefined') {
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
      li.isNeighbor = true;
    } else if(typeof response.Data.CONSORCIOS !== 'undefined') {
      li.isNeighbor = false;
      li.partnershipSelected = response.Data.CONSORCIOS[0].ID;
      for (var consorcio of response.Data.CONSORCIOS) {
        li.partnershipsList.push({
          'ConsorcioId': consorcio.ID,
          'ConsorcioDescripcion': consorcio.DESCRIPCION
        });
      }
    }
  }

  consultarReclamos(){
    this.navCtrl.push('PedidosYSugerenciasPage', {'idConsorcio': this.partnershipSelected});
  }

  goGenerarTicket() {
    this.navCtrl.push('ReclamosPage');
  }

  goHome() {
    this.nav.popToRoot();
  }
}
