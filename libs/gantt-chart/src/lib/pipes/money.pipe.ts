import { Pipe, PipeTransform } from '@angular/core';
import * as accounting from 'accounting';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const new_val = accounting.formatMoney(value, {
      symbol: 'zł', // default currency symbol is '$'
      format: '%v %s ', // controls output: %s = symbol, %v = value/number (can be object: see below)
      decimal: ',', // decimal point separator
      thousand: ' ', // thousands separator
      precision: 2 // decimal places
    });

    return new_val;
  }
}