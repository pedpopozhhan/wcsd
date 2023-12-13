export function convertToCurrency(value: number) {
  const dollars = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
  });
  return dollars.format(value);
}
