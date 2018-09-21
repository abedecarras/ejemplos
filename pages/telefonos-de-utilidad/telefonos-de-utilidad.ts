import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Clipboard } from '@ionic-native/clipboard';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';

@IonicPage()
@Component({
  selector: 'page-telefonos-de-utilidad',
  templateUrl: 'telefonos-de-utilidad.html',
})

export class TelefonosDeUtilidadPage {

  static lastInstance: TelefonosDeUtilidadPage;

  hasManyPartnerships: Boolean;
  partnershipSelected: number;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  phoneNumbers:Array<{descripcion: string, telefono: number, tags: string, valorIcono: number}>;
  botonVerMas:boolean = false;
  limit: number = 0;
  btn_txt = 'VER MÁS';
  show = false;
  companies:any =0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              private callNmb: CallNumber,
              public loading: Loading,
              private contacts: Contacts,
              private clipboard: Clipboard,
              public services: Services) {
    TelefonosDeUtilidadPage.lastInstance = this;
    this.loading.present();
    this.partnershipsList = new Array();
    this.services.getUserData(this.userDataCallback);
  }

  private userDataCallback(response) {
    var li: TelefonosDeUtilidadPage = TelefonosDeUtilidadPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    if (typeof response.Data.UNIDADES_FUNCIONALES === 'undefined') {
      for (var c of response.Data.CONSORCIOS) {
        li.partnershipsList.push({'ConsorcioId': c.ID, 'ConsorcioDescripcion': c.DESCRIPCION});
      }
    } else {
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
    }
    li.hasManyPartnerships = li.partnershipsList && li.partnershipsList.length > 1;
    li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
    li.selectingPartnership();
    li.loading.dismiss();
  }

  private utilPhonesCallback(response) {
    if (response.Success == false) {
      TelefonosDeUtilidadPage.lastInstance.loading.dismiss();
      TelefonosDeUtilidadPage.lastInstance.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    TelefonosDeUtilidadPage.lastInstance.phoneNumbers = response.Data;
    TelefonosDeUtilidadPage.lastInstance.limit = TelefonosDeUtilidadPage.lastInstance.phoneNumbers.length;
    if (response.Data.length >= 5) {
      TelefonosDeUtilidadPage.lastInstance.botonVerMas = true;
    }
    TelefonosDeUtilidadPage.lastInstance.loading.dismiss();
  }

  selectingPartnership() {
    this.loading.present();
    this.services.getUtilPhones(this.partnershipSelected, this.utilPhonesCallback);
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

  action(tel) {
    let actionSheet = this.actionSheetCtrl.create({
      title: tel.descripcion,
      cssClass: 'action-sheets-groups-page',
      buttons: [
        {
          text: 'Llamar',
          cssClass: 'action-botton',
          role: '',
          handler: () => {
            this.call(tel.telefono);
          }
        },{
          text: 'Copiar',
          handler: () => {
            this.copy(tel.telefono)
          }
        },{
          text: 'Guardar en Contactos',
          role: '',
          handler: () => {
            this.save(tel);
          }
        },{
          text: 'Cancelar',
          role: '',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
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

  save(contact) {
    let c: Contact = this.contacts.create();
    c.name = new ContactName(null, contact.descripcion, '');;
    c.phoneNumbers = [new ContactField('mobile', contact.telefono)];
    c.save().then(
      () => this.navCtrl.push('AlertaPage', {
        msj: 'Contacto agregado',
      }),
      (error: any) => this.navCtrl.push('AlertaPage', {
        msj: error,
        isError: true
      })
    );
  }

  copy(number) {
    this.clipboard.copy(number);
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
