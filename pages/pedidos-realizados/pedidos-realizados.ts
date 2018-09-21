import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';

@IonicPage()
@Component({
  selector: 'page-pedidos-realizados',
  templateUrl: 'pedidos-realizados.html',
})

export class PedidosRealizadosPage {

  static lastInstance: PedidosRealizadosPage;

  botonVerMas:boolean = false;
  btn_txt = 'VER MÁS';
  pedidos:Array<{id:any, unidad:string, fecha:string, tipo:string, estado:string}>;
  show:boolean = false;
  isAdmin:boolean;
  month: string;
  year: string;
  idConsorcio: number;
  estado_codigo:string;

  constructor(
    public nav:NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loading: Loading,
    public services: Services) {
      this.loading.present();
      this.month = this.navParams.get('month');
      this.year = this.navParams.get('year');
      this.idConsorcio = this.navParams.get('idConsorcio');
      this.pedidos = new Array();
      PedidosRealizadosPage.lastInstance = this;
      this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: PedidosRealizadosPage = PedidosRealizadosPage.lastInstance;
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
    } else if(typeof response.Data.CONSORCIOS !== 'undefined') {
      li.isAdmin = true;
    }
    li.getClaims();
    li.loading.dismiss();
  }

  private getClaims() {
    this.loading.present();
    this.services.getClaims(this.idConsorcio, 0, Utils.getInstance().getMonthNumberFromName(this.month), this.year, this.getClaimsCallback);
  }

  private getClaimsCallback(response) {
    var li: PedidosRealizadosPage = PedidosRealizadosPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    if (response.Data.length >= 3) {
      PedidosRealizadosPage.lastInstance.botonVerMas = true;
    }
    for (var i of response.Data) {
      li.estado_codigo = i.Estado.Descripcion;
      li.pedidos.push({
        id: i.IdPedido,
        unidad: i.UnidadCarga.Descripcion,
        tipo: i.TipoPedido.Descripcion,
        fecha: i.Fecha,
        estado: i.Estado.Descripcion
      });
    }
    li.loading.dismiss();
  }

  goHome() {
    this.nav.popToRoot();
  }

  goBack() {
    this.nav.pop();
  }

  goNextMonth() {
    var month = Utils.getInstance().getMonthNumberFromName(this.month);
    var year = parseInt(this.year);
    if (month == 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
    this.navCtrl.push('PedidosRealizadosPage', {
      'month': Utils.getInstance().getMonthNameFromNumber(month),
      'year': year,
      'idConsorcio': this.idConsorcio
    });
  }

  goPreviousMonth() {
    var month = Utils.getInstance().getMonthNumberFromName(this.month);
    var year = parseInt(this.year);
    if (month == 1) {
      month = 12;
      year--;
    } else {
      month--;
    }
    this.navCtrl.push('PedidosRealizadosPage', {
      'month': Utils.getInstance().getMonthNameFromNumber(month),
      'year': year,
      'idConsorcio': this.idConsorcio
    });
  }

  goVerTicket(p) {
    this.navCtrl.push('VerTicketPage', {
      'id': p.id
    });
  }

  goGenerarTicket(){
    this.navCtrl.push('ReclamosPage');
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
