import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-reservas-mes',
  templateUrl: 'reservas-mes.html',
})
export class ReservasMesPage {

  static lastInstance: ReservasMesPage;

  botonVerMas:boolean = false;
  btn_txt = 'VER MÁS';
  show:boolean = false;
  month: string = 'Septiembre';

  reservas: Array<{fecha:string, amenity:string,  tipo:string, estado:string}>;

  constructor(public nav:NavController, public navCtrl: NavController, public navParams: NavParams) {
    this.month = this.navParams.get('month');

    this.reservas = [
      { fecha: '12/08/18', amenity: 'SUM', tipo:'Piso 1 Depto4', estado:'ACEPTADO' },
      { fecha: '08/08/18', amenity: 'PILETA', tipo:'Piso 1 Depto4', estado:'PENDIENTE'},
      { fecha: '04/08/18', amenity: 'QUINCHO', tipo:'Piso 1 Depto4', estado:'RECHAZADO'},
      { fecha: '05/09/18', amenity: 'GIMNASIO', tipo:'Piso 1 Depto4', estado:'ACEPTADO'},
      { fecha: '12/08/18', amenity: 'SUM', tipo:'Piso 1 Depto4', estado:'ACEPTADO' },
      { fecha: '08/08/18', amenity: 'PILETA', tipo:'Piso 1 Depto4', estado:'PENDIENTE'},
      { fecha: '04/08/18', amenity: 'QUINCHO', tipo:'Piso 1 Depto4', estado:'RECHAZADO'},
      { fecha: '05/09/18', amenity: 'GIMNASIO', tipo:'Piso 1 Depto4', estado:'ACEPTADO'}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasMesPage');
  }

  goVerReserva(p) {
    this.navCtrl.push('VerReservaPage', {
      'amenity': p.amenity,
    });
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

  goHome() {
    this.nav.popToRoot();
  }

}
