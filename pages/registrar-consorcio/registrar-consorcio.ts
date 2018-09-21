import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';

@IonicPage()
@Component({
  selector: 'page-registrar-consorcio',
  templateUrl: 'registrar-consorcio.html',
})

export class RegistrarConsorcioPage {

  static lastInstance: RegistrarConsorcioPage;

  partnershipsList: Array<{ID: number, DESCRIPCION: string}>;
  partnershipSelected: number;
  ufsList: Array<{Id: number, Descripcion: string}>;
  ufSelected: number;
  paymentMethodsList:Array<{Id: number, Descripcion: string}>;
  paymentMethodSelected: number;
  paymentDate: string;
  paymentCash: string;
  sendVoucher: boolean;
  balanceDate: string;
  balanceCash: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loading: Loading, public services: Services) {
    this.loading.present();
    RegistrarConsorcioPage.lastInstance = this;
    this.services.getPaymentMethods(this.paymentMethodsCallback);
  }

  private paymentMethodsCallback(response) {
    var li: RegistrarConsorcioPage = RegistrarConsorcioPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.services.getUserData(li.userDataCallback);
    li.paymentMethodsList = response.Data;
  }

  private userDataCallback(response) {
    var li: RegistrarConsorcioPage = RegistrarConsorcioPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.partnershipsList = response.Data.CONSORCIOS;
    li.partnershipSelected = response.Data.CONSORCIOS[0].ID;
    li.selectingPartnership();
    li.loading.dismiss();
  }

  private ufsFromPartnershipCallback(response) {
    var li: RegistrarConsorcioPage = RegistrarConsorcioPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.ufsList = response.Data;
    li.ufSelected = response.Data[0].Id;
    li.selectingUF();
    li.loading.dismiss();
  }

  selectingPartnership() {
    this.loading.present();
    this.ufSelected = null;
    this.services.getUFsFromPartnership(this.partnershipSelected, this.ufsFromPartnershipCallback);
  }

  private accountStateCallback(response) {
    var li: RegistrarConsorcioPage = RegistrarConsorcioPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.balanceDate = response.Data.SaldoAl;
    li.balanceCash = response.Data.SaldoAPagar;
    li.loading.dismiss();
  }

  selectingUF() {
    this.loading.present();
    this.services.getAccountState(this.ufSelected, this.accountStateCallback);
  }

  private sendChargeCallback(response) {
    var li: RegistrarConsorcioPage = RegistrarConsorcioPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    let alert = li.alertCtrl.create({
        title: 'Respuesta',
        subTitle: response.Message,
        buttons: ['Aceptar']
      });
    alert.present();
  }

  sendCharge() {
    this.services.sendCharge(
      this.partnershipSelected,
      this.ufSelected,
      this.paymentDate,
      this.paymentMethodSelected,
      this.paymentCash,
      !this.sendVoucher,
      this.sendChargeCallback);
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

}
