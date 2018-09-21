import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-vencimientos',
  templateUrl: 'vencimientos.html',
})
export class VencimientosPage {

  static lastInstance: VencimientosPage;

  vencimientos: Array<{id: number, tipo: string, fecha: string, hora: string, mes: string, titulo: string, descripcion: string}>
  botonVerMas:boolean = false;
  btn_txt = 'VER MÁS';
  show = false;
  hasManyPartnerships: Boolean;
  partnershipSelected: number;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  ano: number;
  mes: number;
  mesLabel: string;
  // isAdmin: boolean;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public loading: Loading,
      public services: Services) {
    VencimientosPage.lastInstance = this;
    var tmp = new Date();
    this.mes = tmp.getMonth() + 1;
    this.mesLabel = Utils.getInstance().getMonthNameFromNumber(this.mes);
    this.ano = tmp.getFullYear();
    this.loading.present();
    this.services.getUserData(this.userDataCallback);
    this.partnershipsList = new Array();
  }

  private userDataCallback(response) {
    var li: VencimientosPage = VencimientosPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    // if (typeof response.Data.UNIDADES_FUNCIONALES === 'undefined') {
      if (typeof response.Data.CONSORCIOS !== 'undefined') {
      //   li.isAdmin = true;
      // }
      // console.log('consorcios:', response.Data.CONSORCIOS)
      for (var c of response.Data.CONSORCIOS) {
        li.partnershipsList.push({'ConsorcioId': c.ID, 'ConsorcioDescripcion': c.DESCRIPCION});
      }

      // console.log('consorcios: ',li.partnershipsList);
      // li.isAdmin = false;
    } else {

      // li.isAdmin = false;
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
    }
    li.hasManyPartnerships = li.partnershipsList && li.partnershipsList.length > 1;
    li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
    li.updateEvents();
    li.loading.dismiss();
    // console.log('consorcios: ',li.partnershipsList);
    // console.log('is admin:', li.isAdmin);
    // console.log('vencimientos:', li.vencimientos)

  }

  updateEvents() {
    this.loading.present();
    this.services.getCalendarEvents(this.partnershipSelected, this.ano, this.mes, this.getCalendarEventsCallback);
  }

  getCalendarEventsCallback(response) {
    var li: VencimientosPage = VencimientosPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.vencimientos = [];
    for (var n of response.Data) {
      li.vencimientos.push({
        'id': n.id,
        'tipo': n.tipo,
        'titulo': n.titulo.length > 23 ? n.titulo.substring(0, 20) + '...' : n.titulo,
        'descripcion': n.descripcion.length > 23 ? n.descripcion.substring(0, 20) + '...' : n.descripcion,
        'fecha': n.fecha,
        'hora': n.hora,
        'mes': n.mes
      });
    }
    if (response.Data.length >= 5) {
      VencimientosPage.lastInstance.botonVerMas = true;
    }
    li.loading.dismiss();
  }

  changeMonth(action) {
    if (action == 'up') {
      if (this.mes == 12) {
        this.mes = 1;
        this.ano++;
      } else {
        this.mes++;
      }
    }

    if (action == 'down') {
      if (this.mes == 1) {
        this.mes = 12;
        this.ano--;
      } else {
        this.mes--;
      }
    }

    this.mesLabel = Utils.getInstance().getMonthNameFromNumber(this.mes);
    this.updateEvents();
  }

  action(idEvent) {
    this.navCtrl.push('VerVencimientoPage', {id: idEvent});
  }

  changeText() {
    if (this.btn_txt == 'VER MÁS') {
      //show more
      this.show = true;
      this.btn_txt = 'VER MENOS';
   } else {
     if (this.btn_txt == 'VER MENOS') {
       //show less
       this.show = false;
       this.btn_txt = 'VER MÁS';
    }
   }
 }

}
