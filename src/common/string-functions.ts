function escapeRegularExpression(value: string) {
  const regularExpression = /[.*+?^${}()|[\]\\]/gi;
  return value.replace(regularExpression, '\\$&');
}

function convertToPascalCase(value: string, symbol: string): string {
  return value
    .split(symbol)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(symbol);
}

export { escapeRegularExpression, convertToPascalCase };