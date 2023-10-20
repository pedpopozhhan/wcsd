export enum ContractType {
  Both = 0,
  Casual = 1,
  LongTerm = 2,
}

export const typeItems: { value: string; label: string }[] = [
  { value: '0', label: 'All Types' },
  { value: '1', label: 'Casual Only' },
  { value: '2', label: 'Long-Term Only' },
];
