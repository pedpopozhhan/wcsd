export function escapeRegularExpression(value: string) {
  const regularExpression = /[.*+?^${}()|[\]\\]/gi;
  return value.replace(regularExpression, '\\$&');
}
