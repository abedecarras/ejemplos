import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';

@IonicPage()
@Component({
  selector: 'page-novedades',
  templateUrl: 'novedades.html',
})
export class NovedadesPage {

  static lastInstance: NovedadesPage;

  news: Array<{id: number, titulo: string, cuerpo: string, fecha: string, leido: string, creadoPorImagen: string, adjuntos: Array<{IdAdjunto: number, Identificador: number, CodigoModulo: string, NombreArchivo: string, URL_Archivo: string, URL_Corta: string}>}>
  botonVerMas:boolean = false;
  btn_txt = 'VER MÁS';
  show = false;
  hasManyUfs: Boolean;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  partnershipSelected: number;
  ufsList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufsActivesList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufSelected: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public services: Services,
    public loading: Loading) {
    NovedadesPage.lastInstance = this;
    this.loading.present();
    this.partnershipsList = new Array();
    this.news = new Array();
    this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: NovedadesPage = NovedadesPage.lastInstance;
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
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
    } else {
      for (var c of response.Data.CONSORCIOS) {
        li.partnershipsList.push({'ConsorcioId': c.ID, 'ConsorcioDescripcion': c.DESCRIPCION});
      }


      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
    }
    li.hasManyUfs = li.partnershipsList && li.partnershipsList.length > 1;
    li.selectingPartnership();
    li.loading.dismiss();
  }

  private getNewsCallback(response) {
    var li: NovedadesPage = NovedadesPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.news = [];
    for (var n of response.Data) {
      li.news.push({
        'id': n.id,
        'titulo': n.titulo.length > 20 ? n.titulo.substring(0, 18) + '...' : n.titulo,
        'cuerpo': n.cuerpo.length > 35 ? n.cuerpo.substring(0, 35) + '...' : n.cuerpo,
        'fecha': n.fecha,
        'leido': n.leido,
        'creadoPorImagen': n.creadoPorImagen,
        'adjuntos': n.adjuntos
      });
    }
    if (li.news.length >= 4) {
      li.botonVerMas = true;
    }
    li.loading.dismiss();
  }

  selectingPartnership() {
    this.loading.present();
    this.services.getNews(this.partnershipSelected, this.getNewsCallback);
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

  goNovedad(newItem) {
    this.navCtrl.push('VerNovedadPage', { id: newItem.id });
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
