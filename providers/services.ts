import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Utils } from './utilsExpensas';
import { Storage } from '@ionic/storage';

@Injectable()
export class Services {
  baseUrl = 'https://api-test.vermisexpensas.com/'; // Endpoint DEV
  // baseUrl = 'https://api.vermisexpensas.com/'; // Endpoint PROD
  publicKey = 'ASNid2rf3non324tg32lng1e2rf';
  token = null;
  static lastInstance: Services;

  constructor(public events: Events, private storage: Storage) {
  	Services.lastInstance = this;
  }

  private doServerRequest(service, body, viewCallback, serviceCallback, hasAttach = false) {
    console.log('DO SERVER REQUEST');
    console.log(service);
    this.storage.get('token').then((val) => {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.baseUrl + service);
      this.token = val;
      if (this.isLoggedIn()) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
      }
      xhr.onreadystatechange = function(data) {
        serviceCallback(data, viewCallback) //  is called every time the readyState changes. Four times (1-4), one time for each change in the readyState.
      }
      if (hasAttach) {
        xhr.send(body);
        console.log('JSON BODY:', body);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        body.ClavePublica = this.publicKey;
        xhr.send(JSON.stringify(body));  //  stringify --> Convert a JavaScript object into a string(JSON)
        console.log('JSON BODY:',JSON.stringify(body));
      }
    });
  };

  private escape(param) {
  	if (typeof param === 'undefined') {
  		return '';
  	}
  	return encodeURIComponent(param);
  }

/**************DEFAULT CALLBACK*************/

  private defaultCallback(data, callback) {
    console.log('DEFAULT CALLBACK');
    if (data.target.readyState === 4) {
    	if (data.target.status == 401) {
          Services.lastInstance.events.publish('user:logout');
    	} else {
	      	// console.log('data target responsetext: ',data.target.responseText);
	      	console.log('JSON RESPONSE TEXT (OBJECT): ',JSON.parse(data.target.responseText));
	      	console.log('success:', JSON.parse(data.target.responseText).Success);
	      	callback(JSON.parse(data.target.responseText)); // .parse  --> Convert a string (JSON) into a JavaScript object
    	}
    }

};

/*******************LOGIN*******************/

  private loginCallback(data, callback) {
    if (data.target.readyState == 4) {
      if (data.target.status == 200) {
        Services.lastInstance.token = JSON.parse(data.target.responseText).Token;
        Services.lastInstance.events.publish('user:login', JSON.parse(data.target.responseText).Token);
        callback(true);
      } else {
        callback(false);
      }
    }
  };

  public requestLogin(user, password, callback) {
    var service = 'login/IniciarSesion';
    var body = {
      "Usuario": this.escape(user),
      "Clave": this.escape(password),
      "FacebookId": "",
      "FacebookEmail": "",
      "FacebookToken": ""
    };
    this.doServerRequest(service, body, callback, this.loginCallback);
  };

  public requestLoginFb(facebookId, facebookEmail, facebookToken, callback) {
    var service = 'login/IniciarSesion';
    var body = {
      "Usuario": '',
      "Clave": '',
      "FacebookId": this.escape(facebookId),
      "FacebookEmail": this.escape(facebookEmail),
      "FacebookToken": this.escape(facebookToken)
    };
    this.doServerRequest(service, body, callback, this.loginCallback);
  };

  public isLoggedIn() {
    return this.token != null;
  };

  public logout() {
    Services.lastInstance.events.publish('user:logout');
  };

  public resetPassword(email, callback) {
    var service = 'Login/RegenerarClave'
      + '?email=' + this.escape(email);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);  
  }

  public asociarIdFacebook(facebookId, callback) {
    var service = 'Servicios/AsociarIdFacebook'
      + '?idFacebook=' + this.escape(facebookId);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback); 
  }

/******************USER******************/

  private isAdminCallback(data, callback) {
    if (data.target.readyState == 4)
      callback(JSON.parse(data.target.responseText).Data.CONSORCIOS);
  };

  public isAdmin(callback) {
    var service = 'Servicios/ObtenerUsuario';
    var body = {};
    this.doServerRequest(service, body, callback, this.isAdminCallback);
  };

  public getUserData(callback) {
    var service = 'Servicios/ObtenerUsuario';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public updateAvatar(urlAvatar, callback) {
    var service = 'Servicios/ActualizarAvatar'
        + '?urlAvatar=' + this.escape(urlAvatar);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

/********************UFs********************/

  public getUFsFromPartnership(idPartnership, callback) {
    var service = 'Servicios/ObtenerUnidadesDelConsorcio'
      + '?idConsorcio=' + this.escape(idPartnership);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
};

/***************ACCOUNT STATE***************/

  public getAccountState(idUF, callback) {
    var service = 'Servicios/ObtenerEstadoDeCuenta'
        + '?idUF=' + this.escape(idUF);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
};

/****************UTIL PHONES****************/

  public getUtilPhones(idConsorcio, callback) {
    var service = 'Servicios/TelefonosUtiles'
        + '?idConsorcio=' + this.escape(idConsorcio);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

/******************CLAIMS*******************/

  public getClaimTypes(callback) {
    var service = 'Servicios/ListadosTiposPedido';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public getClaims(idConsorcio, idUsuario, mes, anio, callback) {
    var service = 'Servicios/PedidosListado'
        + '?IdConsorcio=' + this.escape(idConsorcio)
        + '&_idUsuario=' + this.escape(idUsuario)
        + '&mes=' + this.escape(mes)
        + '&anio=' + this.escape(anio);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public getClaim(idClaim, callback) {
    var service = 'Servicios/PedidosVer'
        + '?idPedido=' + this.escape(idClaim);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public cancelClaim(idClaim, callback) {
    var service = 'Servicios/PedidosActualizarEstado'
        + '?idPedido=' + this.escape(idClaim)
        + '&CodigoEstado=CANCELADO';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public inProgressClaim(idClaim, callback) {
    var service = 'Servicios/PedidosActualizarEstado'
        + '?idPedido=' + this.escape(idClaim)
        + '&CodigoEstado=ENPROCESO';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public finishClaim(idClaim, callback) {
    var service = 'Servicios/PedidosActualizarEstado'
        + '?idPedido=' + this.escape(idClaim)
        + '&CodigoEstado=FINALIZADO';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public rejectClaim(idClaim, callback) {
    var service = 'Servicios/PedidosActualizarEstado'
        + '?idPedido=' + this.escape(idClaim)
        + '&CodigoEstado=RECHAZADO';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public readClaim(idClaim, callback) {
    var service = 'Servicios/PedidosActualizarEstado'
        + '?idPedido=' + this.escape(idClaim)
        + '&CodigoEstado=LEIDO';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public sendClaim(idConsorcio, idType, idUF, idUFAffected, phone, images, comments, callback) {
    var service = 'Servicios/PedidosEnviar'
        + '?IdConsorcio=' + this.escape(idConsorcio)
        + '&TipoPedido=' + this.escape(idType)
        + '&IdUnidadFuncionalCarga=' + this.escape(idUF)
        + '&IdUnidadFuncionalAfectada=' + this.escape(idUFAffected)
        + '&TelefonoContacto=' + this.escape(phone)
        + '&Comentarios=' + this.escape(comments);
    var files = new FormData();
    for (var i = images.length - 1; i >= 0; i--) {
      var f = Utils.getInstance().base64ToFile(images[i]);
      files.append('adjunto', f);
    }
    var body = files;
    this.doServerRequest(service, body, callback, this.defaultCallback, true);
  };

/*****************PAYMENTS******************/

  public getPaymentMethods(callback) {
    var service = 'Servicios/ListadosFormasDePago';
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

  public sendPayment(idConsorcio, idUF, date, idPaymentMethod, voucherNumber, cash, comments, vouchers, callback) {
    var service = 'Servicios/CobrosInformar'
        + '?IdConsorcio=' + this.escape(idConsorcio)
        + '&IdUnidadFuncional=' + this.escape(idUF)
        + '&Fecha=' + this.escape(date)
        + '&IdFormaPago=' + this.escape(idPaymentMethod)
        + '&NroComprobante=' + this.escape(voucherNumber)
        + '&Monto=' + this.escape(cash)
        + '&Comentarios=' + this.escape(comments);
    var files = new FormData();
    for (var i = vouchers.length - 1; i >= 0; i--) {
      var f = Utils.getInstance().base64ToFile(vouchers[i]);
      files.append('adjunto', f);
    }
    var body = files;
    this.doServerRequest(service, body, callback, this.defaultCallback, true);
  };

  public sendPaymentAdmin(idConsorcio, idUF, date, idPaymentMethod, cash, sendVoucher, vouchers, callback) {
    var service = 'Servicios/CobrosIngresar'
        + '?IdConsorcio=' + this.escape(idConsorcio)
        + '&IdUnidadFuncional=' + this.escape(idUF)
        + '&Fecha=' + this.escape(date)
        + '&IdFormaPago=' + this.escape(idPaymentMethod)
        + '&Monto=' + this.escape(cash)
        + '&EnviarComprobante=' + (sendVoucher ? '1' : '0');
    var files = new FormData();
    for (var i = vouchers.length - 1; i >= 0; i--) {
      var f = Utils.getInstance().base64ToFile(vouchers[i]);
      files.append('adjunto', f);
    }
    var body = files;
    this.doServerRequest(service, body, callback, this.defaultCallback, true);
  };

  public sendCharge(idConsorcio, idUF, date, idPaymentMethod, cash, sendVoucher, callback) {
    var service = 'Servicios/CobrosIngresar'
        + '?idConsorcio=' + this.escape(idConsorcio)
        + '&IdUnidadFuncional=' + this.escape(idUF)
        + '&Fecha=' + this.escape(date)
        + '&IdFormaPago=' + this.escape(idPaymentMethod)
        + '&Monto=' + this.escape(cash)
        + '&EnviarComprobante=' + this.escape(sendVoucher);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  };

/*******************PANIC********************/
  
  public sendPanicAlert(latitud, longitud, callback) {
    var service = 'Servicios/AlertaPanicoAgregar'
        + '?latitud=' + this.escape(latitud)
        + '&longitud=' + this.escape(longitud);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

/*******************NEWS********************/

  public getNews(idConsorcio, callback) {
    var service = 'Servicios/NovedadesListar'
        + '?idConsorcio=' + this.escape(idConsorcio);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

  public getNew(idNew, callback) {
    var service = 'Servicios/NovedadesObtener'
        + '?IdNovedad=' + this.escape(idNew);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

  public readNew(idNew, callback) {
    var service = 'Servicios/NovedadesMarcarComoLeida'
        + '?IdNovedad=' + this.escape(idNew);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

/*******************CALENDAR********************/

  public getCalendarEvent(idEvent, callback) {
    var service = 'Servicios/EventosObtener'
        + '?IdEvento=' + this.escape(idEvent);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }

  public getCalendarEvents(idConsorcio, ano, mes, callback) {
    var service = 'Servicios/EventosListar'
        + '?idConsorcio=' + this.escape(idConsorcio)
        + '&año=' + this.escape(ano)
        + '&mes=' + this.escape(mes);
    var body = {};
    this.doServerRequest(service, body, callback, this.defaultCallback);
  }
}