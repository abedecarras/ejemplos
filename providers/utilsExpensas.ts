import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

  private static _instance : Utils;
  private static _mounths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  private static _week = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

  public static getInstance() : Utils {
    if (!Utils._instance)
      Utils._instance = new Utils();
    return Utils._instance;
  }

  private constructor() {}

  public getMonthNumberFromName(label: string) {
    return Utils._mounths.indexOf(label) + 1;
  }

  public getMonthNameFromNumber(number: number) {
    return Utils._mounths[number - 1];
  }

  public getMounth(label: string) {
    return Utils._mounths[Number(label.substring(5, 7)) - 1] + ' ' + label.substring(0, 4);
  }

  public getMounthFromFormatDate(label: string) {
    return Utils._mounths[Number(label.substring(3, 5)) - 1];
  }

  public getYearFromFormatDate(label: string) {
    return label.substring(6);
  }

  public formatDate(date: string) {
    var tmp = new Date(date);
    var dd = ('0' + tmp.getDate()).slice(-2);
    var mm = ('0' + (tmp.getMonth() + 1)).slice(-2);
    var yyyy = tmp.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  }

  public formatLongDate(date: string) {
    var date_array = date.split("/");
    var tmp = new Date(date_array[2] + '/' + date_array[1] + '/' + date_array[0]);
    var dd = ('0' + tmp.getDate()).slice(-2);
    var ww = Utils._week[tmp.getDay()];
    var mm = Utils._mounths[tmp.getMonth()];
    return ww + ' ' + dd + ' de ' + mm;
  }

  public getPartnershipsWithoutRepeats(list) {
    var result = new Array();
    for (var i of list) {
      var alreadyExists: boolean = false;
      for (var j of result)
        alreadyExists = alreadyExists || i.ConsorcioId == j.ConsorcioId;
      if (!alreadyExists)
        result.push(i);
    }
    return result;
  }

  public getMonthsFromClaimsList(list) {
    var flags = [];
    for (var i = 0; i < 12; i++) {
      flags.push(false);
    }
    for (var item of list) {
      var m = this.getMounthFromFormatDate(item.Fecha);
      flags[Utils._mounths.indexOf(m)] = true;
    }
    var result = [];
    for (var j = 0; j < 12; j++) {
      if (flags[j]) {
        result.push(Utils._mounths[j]);
      }
    }
    return result.reverse();
  }

  public getYearsFromClaimsList(list) {
    var years = [];
    for (var item of list) {
      var y = this.getYearFromFormatDate(item.Fecha);
      if (years.indexOf(y) == -1) {
        years.push(y);
      }
    }
    if (years.length == 0) {
      years.push('2018');
    }
    return years.sort(function(a, b){return b-a});
  }

  public base64ToFile(base64, mime = '') {
    var sliceSize = 1024;
    var byteChars = atob(base64.split(',')[1]);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new File([new Blob(byteArrays, {type: mime})], "imagen.jpeg");
  }

}
