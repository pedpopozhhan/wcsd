export type holdbackAmountOption = 'none' | '10%' | '15%';
export const holdbackAmountItems: { value: holdbackAmountOption; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '10%', label: '10%' },
  { value: '15%', label: '15%' },
];