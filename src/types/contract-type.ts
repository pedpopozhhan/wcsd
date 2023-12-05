export type ContractType = 'all' | 'long' | 'casual';
export const typeItems: { value: ContractType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'casual', label: 'Casual Only' },
  { value: 'long', label: 'Long-Term Only' },
];
export function convertContractType(value: ContractType) {
  return value === 'long' ? 'Long-Term' : 'Casual';
}
