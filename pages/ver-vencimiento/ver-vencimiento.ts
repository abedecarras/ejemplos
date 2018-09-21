import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Loading } from '../../providers/loading';
import { Services } from '../../providers/services';
import { Utils } from '../../providers/utilsExpensas';


@IonicPage()
@Component({
  selector: 'page-ver-vencimiento',
  templateUrl: 'ver-vencimiento.html',
})
export class VerVencimientoPage {

  static lastInstance: VerVencimientoPage;

  idEvent: number;
  tipo: string;
  fecha: string;
  hora: string;
  titulo: string;
  descripcion: string;
  mes: string;


  constructor(public navCtrl: NavController,
  		public navParams: NavParams,
  		public loading: Loading,
      public services: Services) {
    this.loading.present();
    VerVencimientoPage.lastInstance = this;
    this.idEvent = navParams.get('id');
    this.services.getCalendarEvent(this.idEvent, this.getCalendarEventCallback);
  }

  private getCalendarEventCallback(response) {
  	var li: VerVencimientoPage = VerVencimientoPage.lastInstance;
  	if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
  	li.tipo = response.Data[0].tipo;
  	li.fecha = Utils.getInstance().formatLongDate(response.Data[0].fecha);
  	li.hora = response.Data[0].hora + ' hs';
  	li.titulo = response.Data[0].titulo;
  	li.descripcion = response.Data[0].descripcion;
  	li.mes = response.Data[0].mes;
  	li.loading.dismiss();
  }

}
