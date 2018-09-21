import { Component, ViewChild  } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';
import $ from 'jquery'

@IonicPage()
@Component({
  selector: 'page-enviar-comprobante',
  templateUrl: 'enviar-comprobante.html'
})

export class EnviarComprobantePage {
  @ViewChild('myInput') myInput;

  static lastInstance: EnviarComprobantePage;

  hasManyUfs: Boolean;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  partnershipSelected: number;
  ufsList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufsActivesList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufSelected: number;
  balanceDate: string;
  balanceCash: string;
  paymentDate: string;
  paymentDateHasError: boolean = false;
  paymentMethods:Array<{Id: number, Descripcion: string}>;
  paymentMethodSelected: number;
  paymentMethodSelectedHasError: boolean = false;
  paymentVoucher: string;
  paymentCash: number;
  paymentCashHasError: boolean = false;
  paymentComments: string;
  paymentSendVoucher: boolean;
  vouchers: Array<string>;
  errors: Array<string>;

  companies:any =0;
  notTaken:boolean = true;
  loaded: Array<boolean>;

  isAdmin: boolean;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private camera: Camera,
    public loading: Loading,
    public services: Services) {

    EnviarComprobantePage.lastInstance = this;
    this.loading.present();
    this.vouchers = new Array<string>();
    this.loaded = new Array<boolean>();
    this.partnershipsList = new Array();
    this.ufsList = new Array();
    this.ufsActivesList = new Array();
    this.paymentSendVoucher = true;
    this.services.getPaymentMethods(this.paymentMethodsCallback);
  }

  private paymentMethodsCallback(response) {
    var li: EnviarComprobantePage = EnviarComprobantePage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.services.getUserData(li.userDataCallback);
    li.paymentMethods = response.Data;
  }

  private userDataCallback(response) {
    var li: EnviarComprobantePage = EnviarComprobantePage.lastInstance;
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
      li.ufsActivesList = response.Data.UNIDADES_FUNCIONALES;
      li.ufsList = response.Data.UNIDADES_FUNCIONALES;
      li.hasManyUfs = li.ufsList && li.ufsList.length > 1;
      li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
      li.ufSelected = li.ufsList[0].UnidadFuncionalId;
      li.selectingUF();
    } else {
      if(typeof response.Data.CONSORCIOS !== 'undefined') {
        li.isAdmin = true;
      }
      for (var c of response.Data.CONSORCIOS) {
        li.partnershipsList.push({'ConsorcioId': c.ID, 'ConsorcioDescripcion': c.DESCRIPCION});
      }
      li.partnershipSelected = li.partnershipsList[0].ConsorcioId;
      li.selectingPartnership();
    }
    li.loading.dismiss();
  }

  private accountStateCallback(response) {
    var li: EnviarComprobantePage = EnviarComprobantePage.lastInstance;
    if (response.Success) {
      li.balanceDate = response.Data.SaldoAl;
      li.balanceCash = response.Data.SaldoAPagar;
    } else {
      li.navCtrl.push('AlertaPage', {
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
    }
    li.loading.dismiss();
  }

  selectingUF() {
    this.loading.present();
    this.services.getAccountState(this.ufSelected, this.accountStateCallback);
  }

  selectingPartnership() {
    this.loading.present();
    this.services.getUFsFromPartnership(this.partnershipSelected, this.selectingPartnershipCallback);
  }

  selectingPartnershipCallback(response) {
    var li: EnviarComprobantePage = EnviarComprobantePage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.ufsActivesList = new Array();
    li.ufsList = new Array();
    for (var d of response.Data) {
      li.ufsActivesList.push({'UnidadFuncionalId': d.Id, 'UnidadFuncionalNombre': d.Descripcion, 'ConsorcioId': d.Consorcio});
      li.ufsList.push({'UnidadFuncionalId': d.Id, 'UnidadFuncionalNombre': d.Descripcion, 'ConsorcioId': d.Consorcio});
    }
    li.hasManyUfs = li.ufsList && li.ufsList.length > 1;
    li.ufSelected = li.ufsList[0].UnidadFuncionalId;
    li.selectingUF();
    li.loading.dismiss();
  }

  private sendPaymentCallback(response) {
    let li = EnviarComprobantePage.lastInstance;
    li.loading.dismiss();
    if (response.Success) {
      li.navCtrl.push('AlertaPage', {
        msj: response.Message,
        returnToRoot: true
      });
    } else {
      li.navCtrl.push('AlertaPage', {
        msj: response.Message || response.Error,
        isError: true
      });
    }
  }

  runCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.loading.present();
    this.camera.getPicture(options).then((imageData) => {
      this.notTaken = false;
      EnviarComprobantePage.lastInstance.vouchers.push('data:image/jpeg;base64,' + imageData);
      EnviarComprobantePage.lastInstance.loading.dismiss();
    }, (err) => {
      EnviarComprobantePage.lastInstance.loading.dismiss();
      this.navCtrl.push('AlertaPage', {
        msj: err,
        isError: true
      });
    });

    // Descomentar para testear en browser
    // this.notTaken = false;
    // EnviarComprobantePage.lastInstance.vouchers.push("data:image/jpeg;base64,imageData");
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.JPEG
    }

    this.loading.present();
    this.camera.getPicture(options).then((imageData) => {
      this.notTaken = false;
      EnviarComprobantePage.lastInstance.vouchers.push('data:image/jpeg;base64,' + imageData);
      EnviarComprobantePage.lastInstance.loading.dismiss();
    }, (err) => {
      EnviarComprobantePage.lastInstance.loading.dismiss();
      if (err == 'No Image Selected') {
        return;
      }
      if (err == 'Unable to retrieve path to picture!') {
        err = 'El formato de la imágen no está soportado';
      }
      this.navCtrl.push('AlertaPage', {
        msj: err,
        isError: true
      });
    });

    // Descomentar para testear en browser
    // this.notTaken = false;
    // EnviarComprobantePage.lastInstance.vouchers.push("data:image/jpeg;base64,imageData");
  }

  sendPayment() {
    if (!this.validate()) {
      return;
    }

    this.loading.present();
    if (this.isAdmin) {
      this.services.sendPaymentAdmin(
        this.partnershipSelected,
        this.ufSelected,
        Utils.getInstance().formatDate(this.paymentDate),
        this.paymentMethodSelected,
        this.paymentCash,
        this.paymentSendVoucher,
        this.vouchers,
        this.sendPaymentCallback
      );
    } else {
      this.services.sendPayment(
        this.partnershipSelected,
        this.ufSelected,
        Utils.getInstance().formatDate(this.paymentDate),
        this.paymentMethodSelected,
        this.paymentVoucher,
        this.paymentCash,
        this.paymentComments,
        this.vouchers,
        this.sendPaymentCallback
      );
    }
  }

  private validate() {
    var executionOK = true;
    if (this.paymentMethodSelected) {
      this.paymentMethodSelectedHasError = false;
    } else {
      this.paymentMethodSelectedHasError = true;
      executionOK = false;
    }

    if (this.paymentDate) {
      this.paymentDateHasError = false;
    } else {
      this.paymentDateHasError = true;
      executionOK = false;
    }

    if (this.paymentCash) {
      this.paymentCashHasError = false;
    } else {
      this.paymentCashHasError = true;
      executionOK = false;
    }

    return executionOK;
  }

  goBack() {
    this.navCtrl.setRoot('HomePage');
  }

  load(index) {
    $(document).ready(function(){
      var lp = 0,
      progress = setInterval(function(){
        $('.index-' + index + ' .progress-outer .progress-inner').css({'width':lp+'%'});
        if (lp==100){
          clearInterval(progress);
        }
        else{
          lp=lp+1;
        }
      }, 5);

    });
    setTimeout(() => this.loaded[index] = true
    , 500)
  }

  removeItem(index) {
    this.vouchers.splice(index, 1);
    this.loaded.splice(index, 1);
    if (this.loaded.length == 0) {
      this.notTaken = true;
    }
  }

  // metodo para resizear el cuadro de los comentarios - descomentar para usar con <textarea>
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

}
