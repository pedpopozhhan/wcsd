export type ContractType = 'all' | 'long' | 'casual';
export const typeItems: { value: ContractType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'casual', label: 'Casual Only' },
  { value: 'long', label: 'Long-Term Only' },
];
