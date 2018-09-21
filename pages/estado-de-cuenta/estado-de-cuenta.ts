import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';

@IonicPage()
@Component({
  selector: 'page-estado-de-cuenta',
  templateUrl: 'estado-de-cuenta.html',
})

export class EstadoDeCuentaPage {

  static lastInstance: EstadoDeCuentaPage;

  hasManyUfs: Boolean;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  partnershipSelected: number;
  ufsList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufsActivesList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufSelected: number;
  liquidationsList: Array<{ID_Liquidacion: number, FechaDesde: string}>;
  balanceDate: string;
  balanceCash: string;
  balancePaid: string;
  balanceExpiration: string;
  success: boolean;

  constructor(
    public navCtrl: NavController,
    private nav:NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loading: Loading,
    public services: Services) {
    EstadoDeCuentaPage.lastInstance = this;
    this.loading.present();
    this.partnershipsList = new Array();
    this.ufsList = new Array();
    this.ufsActivesList = new Array();
    this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: EstadoDeCuentaPage = EstadoDeCuentaPage.lastInstance;
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
      li.ufsActivesList = response.Data.UNIDADES_FUNCIONALES;
      li.ufsList = response.Data.UNIDADES_FUNCIONALES;
      li.hasManyUfs = li.ufsList && li.ufsList.length > 1;
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
      li.ufSelected = li.ufsList[0].UnidadFuncionalId;
      li.selectingUF();
    } else {
      for (var c of response.Data.CONSORCIOS) {
        li.partnershipsList.push({'ConsorcioId': c.ID, 'ConsorcioDescripcion': c.DESCRIPCION});
      }
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
      li.selectingPartnership();
    }
    li.loading.dismiss();
  }

  private accountStateCallback(response) {
    var li: EstadoDeCuentaPage = EstadoDeCuentaPage.lastInstance;
    let success = response.Success;
    if (success){
      li.balanceDate = response.Data.SaldoAl;
      li.balanceCash = response.Data.SaldoAPagar;
      li.balancePaid = response.Data.Pagos;
      li.balanceExpiration = response.Data.Vencimiento;
      li.liquidationsList = response.Data.Liquidaciones;
      for (var liq of li.liquidationsList){
        liq.FechaDesde = Utils.getInstance().getMounth(liq.FechaDesde);
      }

    } else {
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
    }
    li.loading.dismiss();
}

  selectingUF() {
    this.loading.present();
    this.services.getAccountState(this.ufSelected, this.accountStateCallback);
  }

  selectingPartnership() {
    this.loading.present();
    this.services.getUFsFromPartnership(this.partnershipSelected, this.selectingPartnershipCallback);
  }

  selectingPartnershipCallback(response) {
    var li: EstadoDeCuentaPage = EstadoDeCuentaPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.ufsActivesList = new Array();
    li.ufsList = new Array();
    for (var d of response.Data) {
      li.ufsActivesList.push({'UnidadFuncionalId': d.Id, 'UnidadFuncionalNombre': d.Descripcion, 'ConsorcioId': d.Consorcio});
      li.ufsList.push({'UnidadFuncionalId': d.Id, 'UnidadFuncionalNombre': d.Descripcion, 'ConsorcioId': d.Consorcio});
    }
    li.hasManyUfs = li.ufsList && li.ufsList.length > 1;
    li.ufSelected = li.ufsList[0].UnidadFuncionalId;
    li.selectingUF();
    li.loading.dismiss();
  }

  goToLiquidationScreen(summary) {
    this.navCtrl.push('LiquidacionPage', {
      'summary': summary
    });
  }

  goHome() {
    this.nav.popToRoot();
  }

}
