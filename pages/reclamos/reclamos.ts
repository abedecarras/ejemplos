import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Services } from '../../providers/services';
import { Loading } from '../../providers/loading';
import { Utils } from '../../providers/utilsExpensas';
// import { FormsModule } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-reclamos',
  templateUrl: 'reclamos.html',
})

export class ReclamosPage {
  @ViewChild('myInput') myInput;

  static lastInstance: ReclamosPage;

  hasManyUfs: Boolean;
  partnershipsList: Array<{ConsorcioId: number, ConsorcioDescripcion: string}>;
  partnershipSelected: number;
  ufsList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufsActivesList: Array<{UnidadFuncionalId: number, UnidadFuncionalNombre: string, ConsorcioId: number}>;
  ufsOthersList: Array<{Id: number, Descripcion: string}>;
  ufSelected: number;
  claimTypes:Array<{Id: number, Descripcion: string}>;
  claimTypeSelected: number;
  claimTypeSelectedHasError: boolean = false;
  isOtherUFAffected: boolean;
  otherUfSelected: number;
  phone: string;
  phoneHasError: boolean = false;
  comments: string;
  commentsHasError: boolean = false;

  companies:any =0;
  notTaken:boolean = true;
  loaded: Array<boolean>;
  images: Array<string>;

  constructor(
    public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private camera: Camera,
    public loading: Loading,
    public services: Services) {
    this.loading.present();
    ReclamosPage.lastInstance = this;
    this.images = new Array<string>();
    this.loaded = new Array<boolean>();
    this.services.getClaimTypes(this.claimTypesCallback);
  }

  private claimTypesCallback(response) {
    var li: ReclamosPage = ReclamosPage.lastInstance;
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
    li.claimTypes = response.Data;
  }

  private userDataCallback(response) {
    var li: ReclamosPage = ReclamosPage.lastInstance;
    if (response.Success == false) {
      li.loading.dismiss();
      li.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    li.ufsList = response.Data.UNIDADES_FUNCIONALES;
    li.partnershipsList = Utils.getInstance().getPartnershipsWithoutRepeats(response.Data.UNIDADES_FUNCIONALES);
    li.hasManyUfs = li.ufsList && li.ufsList.length > 1;
    li.partnershipSelected = li.ufsList[0].ConsorcioId;
    li.selectingPartnership();
    li.loading.dismiss();
  }

  private otherUFsCallback(response) {
    if (response.Success == false) {
      ReclamosPage.lastInstance.loading.dismiss();
      ReclamosPage.lastInstance.navCtrl.push('AlertaPage',{
        msj: response.Message || response.Error,
        isError: true,
        returnToRoot: true
      });
      return;
    }
    ReclamosPage.lastInstance.ufsOthersList = response.Data;
    ReclamosPage.lastInstance.otherUfSelected = response.Data[0].Id;
    ReclamosPage.lastInstance.loading.dismiss();
  }

  selectingPartnership() {
    this.loading.present();
    var li: ReclamosPage = ReclamosPage.lastInstance;
    this.services.getUFsFromPartnership(li.partnershipSelected, li.otherUFsCallback);
    li.ufsActivesList = new Array();
    for (var uf of li.ufsList)
      if (uf.ConsorcioId == li.partnershipSelected)
        li.ufsActivesList.push(uf);
    li.ufSelected = li.ufsActivesList[0].UnidadFuncionalId;
  }

  private sendClaimCallback(response) {
    let li = ReclamosPage.lastInstance;
    li.loading.dismiss();
    if (response.Success) {
      let currentIndex = li.navCtrl.getActive().index;
      li.navCtrl.push('AlertaPage', {
        msj: response.Message,
      }).then(() => {
        li.navCtrl.remove(currentIndex, 1);
      });
    } else {
      li.navCtrl.push('AlertaPage', {
        msj: response.Message || response.Error,
        isError: true
      });
    }
  }

  sendClaim() {
    if (!this.validate()) {
      return;
    }

    if (!this.isOtherUFAffected)
      this.otherUfSelected = 0;

    this.loading.present();
    this.services.sendClaim(
      this.partnershipSelected,
      this.claimTypeSelected,
      this.ufSelected,
      this.otherUfSelected,
      this.phone,
      this.images,
      this.comments,
      this.sendClaimCallback);
  }

  private validate() {
    var executionOK = true;
    if (this.claimTypeSelected) {
      this.claimTypeSelectedHasError = false;
    } else {
      this.claimTypeSelectedHasError = true;
      executionOK = false;
    }

    if (this.phone) {
      this.phoneHasError = false;
    } else {
      this.phoneHasError = true;
      executionOK = false;
    }

    return executionOK;
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
      ReclamosPage.lastInstance.images.push('data:image/jpeg;base64,' + imageData);
      ReclamosPage.lastInstance.loading.dismiss();
    }, (err) => {
      ReclamosPage.lastInstance.loading.dismiss();
      this.navCtrl.push('AlertaPage', {
        msj: err,
        isError: true
      });
    });

    // Descomentar para testear en browser
    // this.notTaken = false;
    // ReclamosPage.lastInstance.images.push("data:image/jpeg;base64,imageData");
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
      ReclamosPage.lastInstance.images.push('data:image/jpeg;base64,' + imageData);
      ReclamosPage.lastInstance.loading.dismiss();
    }, (err) => {
      ReclamosPage.lastInstance.loading.dismiss();
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
    // ReclamosPage.lastInstance.images.push("data:image/jpeg;base64,imageData");
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
    this.images.splice(index, 1);
    this.loaded.splice(index, 1);
    if (this.loaded.length == 0) {
      this.notTaken = true;
    }
  }

  // metodo para resizear el cuadro de los comentarios - descomentar para usar con <textarea>
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  goHome() {
    this.nav.popToRoot();
  }


}
