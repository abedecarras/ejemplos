import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'europeFormat',
})

export class EuropeFormatPipe implements PipeTransform {
  /**
   * take a number format like xxxxxxxx.ddddd and returns xx.xxx.xxx,dd  (x:whole part, d:decimal part)
   */
  transform(value: number, ...args) {

    let whole ='', decimal='', newValue ='';
    let val = String(value);
    let size = val.length;
    let dotPos = 0;
    let find = false;
    let decimalSize = 0;
    let separator = ',';

    /* decimal part */
    for(let i = 0; i < size && decimalSize < 2 ; i++) {
        if (find){
        decimalSize += 1;
        decimal = decimal + val[i];
      }
      if (val[i] == '.'){
        dotPos = i;
        find = true;
      }
    }
    /* if haven't got '.'*/
    if (!find) {
      dotPos = size;
      separator = '';
    }

    /* whole part */
    for(let j = dotPos - 1 , cont=0; j >= 0 ; j--, cont++){
      if (cont == 3){
        whole = '.' + whole;
        cont = 0;
      }
      whole = val[j] + whole;
    }

    /* result */
    newValue = whole + separator + decimal;
    return newValue;

  }

}
