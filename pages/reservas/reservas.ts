import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {

  months: Array<string>;

  constructor(public navCtrl: NavController,  public nav:NavController, public navParams: NavParams) {

    this.months = [
      'septiembre',
      'octubre',
      'noviembre'
    ];

    // this.amenities = [
    //   { name: 'SUM', component: 'SumPage' },
    //   { name: 'PILETA', component: 'PiletaPage'},
    //   { name: 'QUINCHO', component: 'QuinchoPage'},
    //   { name: 'GIMNASIO', component: 'GimnasioPage'},
    // ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasPage');
  }

  goHome() {
    this.nav.popToRoot();
  }

  goMonth(m) {
    this.navCtrl.push('ReservasMesPage', {
      'month': m,
      // 'year': this.periodo,
      // 'idConsorcio': this.idConsorcio
    });
  }

}
