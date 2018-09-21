import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { CallNumber } from '@ionic-native/call-number';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-ver-ticket',
  templateUrl: 'ver-ticket.html',
})

export class VerTicketPage {
  static lastInstance: VerTicketPage;

  idClaim:number;
  idConsorcio:number;
  fecha:string;
  tipo:string;
  estado:string;
  estado_codigo:string;
  telefono:string;
  usuario:string;
  unidadAfectada:string;
  comentarios:string;
  adjuntos:Array<string>;
  isNeighbor: boolean;

  constructor(public navCtrl: NavController,
              public nav:NavController,
              private callNmb: CallNumber,
              public navParams: NavParams,
              public loading: Loading,
              public services: Services) {
    this.loading.present();
    this.idClaim = navParams.get('id');
    this.adjuntos = new Array<string>();
    VerTicketPage.lastInstance = this;
    this.services.getUserData(this.userDataCallback);

  }

  private userDataCallback(response) {
    var li: VerTicketPage = VerTicketPage.lastInstance;
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
      li.isNeighbor = true;
    } else if(typeof response.Data.CONSORCIOS !== 'undefined') {
      li.isNeighbor = false;
    }
    li.getClaim();
  }

  private getClaim() {
    this.services.getClaim(this.idClaim, this.getClaimCallback);
  }

  private getClaimCallback(response) {
    var li: VerTicketPage = VerTicketPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.idConsorcio = response.Data.Consorcio.Id;
    li.fecha = response.Data.Fecha;
    li.tipo = response.Data.TipoPedido.Descripcion;
    li.estado = response.Data.Estado.Descripcion;
    li.estado_codigo = response.Data.Estado.Codigo;
    li.telefono = response.Data.TelefonoContacto;
    li.usuario = response.Data.Usuario.Value;
    if (typeof response.Data.UnidadAfectada.Descripcion != 'undefined') {
      li.unidadAfectada = response.Data.UnidadAfectada.Descripcion;
    } else {
      li.unidadAfectada = '';
    }
    li.comentarios = response.Data.Comentarios;
    li.adjuntos = response.Data.Adjuntos;
    if (li.estado_codigo == 'PENDIENTE' && !li.isNeighbor) {
      li.leido();
    }
    li.loading.dismiss();
  }

  public leido() {
    this.loading.present();
    this.services.readClaim(this.idClaim, this.leidoCallback);
  }

  private leidoCallback(response) {
      var li: VerTicketPage = VerTicketPage.lastInstance;
      if (response.Success == false) {
        li.loading.dismiss();
        li.navCtrl.push('AlertaPage',{
          msj: response.Message || response.Error,
          isError: true,
          returnToRoot: true
        });
        return;
      }
      li.estado = 'LEIDO';
      li.estado_codigo = 'LEIDO';
      li.loading.dismiss();
  }

  public cancelar() {
    this.loading.present();
    this.services.cancelClaim(this.idClaim, this.changeStateClaimCallback);
  }

  public enProgreso() {
    this.loading.present();
    this.services.inProgressClaim(this.idClaim, this.changeStateClaimCallback);
  }

  public rechazar() {
    this.services.rejectClaim(this.idClaim, this.changeStateClaimCallback);
    this.loading.present();
  }

  public finalizar() {
    this.loading.present();
    this.services.finishClaim(this.idClaim, this.changeStateClaimCallback);
  }

  private changeStateClaimCallback(response) {
    var li: VerTicketPage = VerTicketPage.lastInstance;
    let currentIndex = li.navCtrl.getActive().index;
    li.loading.dismiss();
    li.navCtrl.push('AlertaPage', {
      msj: response.Message,
      returnToPage: 'PedidosRealizadosPage',
      params: {
        'year': Utils.getInstance().getYearFromFormatDate(li.fecha),
        'month': Utils.getInstance().getMounthFromFormatDate(li.fecha),
        'idConsorcio': li.idConsorcio
      }
    }).then(() => {
      li.navCtrl.remove(currentIndex - 1, 2);
    });
  }

  call(number) {
    this.callNmb.callNumber(number, true).then(() => {
    }).catch((err) => {
      this.navCtrl.push('AlertaPage', {
        msj: err,
        isError: true
      });
    });
  }

  goHome() {
    this.nav.popToRoot();
  }
}
