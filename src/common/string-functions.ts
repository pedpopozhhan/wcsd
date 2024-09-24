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

function replaceSpacesWithNonBreaking(input: string): string {
  return input.replace(/ /g, '\u00A0');
}

export { escapeRegularExpression, convertToPascalCase, replaceSpacesWithNonBreaking };