import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-ver-novedad',
  templateUrl: 'ver-novedad.html',
})
export class VerNovedadPage {

  static lastInstance: VerNovedadPage;

  idNew: number;
  avatarUrl: string;
  titulo: string;
  cuerpo: string;
  adjuntos: Array<{IdAdjunto: number, Identificador: number, CodigoModulo: string, NombreArchivo: string, URL_Archivo: string, URL_Corta: string}>

  constructor(public navCtrl: NavController,
      public nav:NavController,
  		public navParams: NavParams,
    	public services: Services,
      public loading: Loading,
    	public platform: Platform,
      private iab: InAppBrowser) {
	this.idNew = navParams.get('id');
	VerNovedadPage.lastInstance = this;
  this.loading.present();
  this.services.getNew(this.idNew, this.getNewCallback);
  }

  private getNewCallback(response) {
    var li: VerNovedadPage = VerNovedadPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.avatarUrl = response.Data[0].creadoPorImagen;
    li.titulo = response.Data[0].titulo;
    li.cuerpo = response.Data[0].cuerpo;
    li.adjuntos = response.Data[0].adjuntos;

    if (response.Data[0].leido == 'NO') {
	    li.loading.present();
      li.services.readNew(li.idNew, li.readNewCallback);
    }
	  li.loading.dismiss();
  }

  private readNewCallback(response) {
    var li: VerNovedadPage = VerNovedadPage.lastInstance;
    li.loading.dismiss();
  }

  goHome() {
    this.nav.popToRoot();
  }

  open(url) {
    let options : InAppBrowserOptions = {
        location : 'yes',
    };
    this.iab.create(url, '_system', options);
  }
}
