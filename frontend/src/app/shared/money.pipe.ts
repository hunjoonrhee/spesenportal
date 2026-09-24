import { Pipe, PipeTransform } from '@angular/core';

const formatters = new Map<string, Intl.NumberFormat>();

/** Formatiert Beträge im deutschen Format, z. B. 1.234,50 €. */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency = 'EUR'): string {
    if (amount === null || amount === undefined) return '';
    let formatter = formatters.get(currency);
    if (!formatter) {
      formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency });
      formatters.set(currency, formatter);
    }
    return formatter.format(amount);
  }
}
