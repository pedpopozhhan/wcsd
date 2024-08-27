export function convertToCurrency(value: number | string) {
  const dollars = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
  });
  return dollars.format(Number(value));
}
