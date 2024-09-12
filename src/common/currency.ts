export function convertToCurrency(value: number | string) {
  const formattedValue = Number(value).toFixed(2);
  const parts = formattedValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${parts.join('.')}`;
}
