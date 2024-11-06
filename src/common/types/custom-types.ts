export type ContractType = 'all' | 'long' | 'casual';
export const typeItems: { value: ContractType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'casual', label: 'Casual Only' },
  { value: 'long', label: 'Long-Term Only' },
];
export function convertContractType(value: ContractType) {
  return value === 'long' ? 'Long-Term' : 'Casual';
}

export const EmptyGuid = '00000000-0000-0000-0000-000000000000';

export type holdbackAmountOption = 'none' | '10%' | '15%';
export const holdbackAmountItems: { value: holdbackAmountOption; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '10%', label: '10%' },
  { value: '15%', label: '15%' },
];

export const PaymentStatusSubmitted = 'submitted';
export const PaymentStatusPosted = 'posted';
export const PaymentStatusCleared = 'cleared';


export type InvoiceAgeOption = 'All ages' | '1-30' | '30-60' | '60 +';
export const InvoiceAgeOptionItems: { value: InvoiceAgeOption; label: string }[] = [
  { value: 'All ages', label: 'All ages' },
  { value: '1-30', label: '< 30' },
  { value: '30-60', label: '30-60' },
  { value: '60 +', label: '> 60' },
];
export type RecordsPerPageOption = '10' | '20' | '30' | '40' | '50' | '100';
export const RecordsPerPageOptionItems: { value: RecordsPerPageOption; label: string }[] = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '40', label: '40' },
  { value: '50', label: '50' },
  { value: '100', label: '100' }
];

export type InvoiceStatusOption = 'Draft' | 'Processed';
export const InvoiceStatusOptionItems: { value: InvoiceStatusOption; label: string }[] = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Processed', label: 'Processed' }
];

export interface IOptionType {
  value: string;
  label: string;
}
