import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class Loading {

  loading: any;
  count: number;

  constructor(public loadingCtrl: LoadingController) {
    this.count = 0;
  }

  present() {
    if (this.count == 0) {
      this.loading = this.loadingCtrl.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
    }
    this.count++;
  }

  dismiss() {
    if (this.count == 1) {
      this.loading.dismiss();
    }
    this.count--;
  }

  dismissAll() {
    if (this.count > 0) {
      this.loading.dismiss();
    }
    this.count = 0;
  }
}
