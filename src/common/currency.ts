export function convertToCurrency(value: number | string) {
  const dollars = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
  });
  return dollars.format(Number(value));
}
