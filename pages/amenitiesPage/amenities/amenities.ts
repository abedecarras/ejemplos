import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-amenities',
  templateUrl: 'amenities.html',
})
export class AmenitiesPage {

  // amenities: Array<{name: string, component:any }>;
  amenities: Array<string>;
  grid: Array<Array<string>>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // this.amenities = [
    //   { name: 'SUM', component: 'SumPage' },
    //   { name: 'PILETA', component: 'PiletaPage'},
    //   { name: 'QUINCHO', component: 'QuinchoPage'},
    //   { name: 'GIMNASIO', component: 'GimnasioPage'},
    //   { name: 'LOUNDRY', component: 'GimnasioPage'},
    //   { name: 'CANCHA TENIS', component: 'GimnasioPage'},
    //   { name: 'PARRILLA', component: 'GimnasioPage'},
    //   { name: 'SAUNA', component: 'GimnasioPage'},
    // ];

    this.amenities = [
      'SUM',
      'PILETA',
      'QUINCHO',
      'GIMNASIO',
      'LOUNDRY',
      'CANCHA TENIS',
      'PARRILLA',
      'SAUNA',
    ];

    this.grid = Array(Math.ceil(this.amenities.length/2)); //MATHS!

    console.log('amenities;', this.amenities);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AmenitiesPage');

    let rowNum = 0; //counter to iterate over the rows in the grid

  for (let i = 0; i < this.amenities.length; i+=2) { //iterate images

    this.grid[rowNum] = Array(2); //declare two elements per row

    if (this.amenities[i]) { //check file URI exists
      this.grid[rowNum][0] = this.amenities[i] //insert image
    }

    if (this.amenities[i+1]) { //repeat for the second image
      this.grid[rowNum][1] = this.amenities[i+1]
    }

    rowNum++; //go on to the next row
  }

  }

  goPileta() {
    this.navCtrl.push('PiletaPage');
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

  openPage(a) {
    this.navCtrl.push(a.component);
  }

  goAmenity(a) {
    this.navCtrl.push('AmenityPage', {
      'amenity':a,
    });
  }

  goReservas() {
    this.navCtrl.push('ReservasPage');
  }

}
