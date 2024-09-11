import numeral from 'numeral';

export function convertToCurrency(value: number | string) {
  const dollars = numeral(value).format('$0,0.00');
  return dollars;
}
