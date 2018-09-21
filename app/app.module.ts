import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Badge } from '@ionic-native/badge';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts } from '@ionic-native/contacts';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
// import { LoginService } from '../services/login.service';
// import { ServicesProvider } from '../providers/services/services';
import { Loading } from '../providers/loading';
import { Services } from '../providers/services';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist : true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CallNumber,
    Contacts,
    Clipboard,
    SocialSharing,
    Badge,
    Facebook,
    Camera,
    Geolocation,
    ImagePicker,
    Loading,
    Services,
    File,
    FileTransfer,
    FileOpener,
    InAppBrowser,
    Diagnostic,
    // ServicesProvider
  ]
})
export class AppModule {}
