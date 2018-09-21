import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { DatePicker } from '@ionic-native/date-picker';
// import * as $ from 'jquery';

//declare var jquery:any;
declare var $:any;

@IonicPage()
@Component({
  selector: 'page-gimnasio',
  templateUrl: 'gimnasio.html',
})
export class GimnasioPage {


  constructor(public navCtrl: NavController,
              public navParams: NavParams
              // private datePicker: DatePicker
              ) {
  }

  toggle() {
    $('.title').slideToggle();
  }

  dPicker() {
    $('.datepicker').datepicker({
    	weekStart:1
    });
  }

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GimnasioPage');
  }

 // evento() {
 //  this.datePicker.show({
 //  date: new Date(),
 //  mode: 'date',
 //  androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
 //  }).then(
 //          date => console.log('Got date: ', date),
 //          err => console.log('Error occurred while getting date: ', err)
 //         );
 //
 //  }

}
