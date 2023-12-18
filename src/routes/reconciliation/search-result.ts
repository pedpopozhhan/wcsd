export class SearchResult {
  index: number;
  vendorName: string;
  businessId: number;
  contractId: number;
  contractNumber: string;
  contractType: string;
  numTimeReports: number;
}

const searchResultColumns: { value: string; label: string }[] = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'businessId', label: 'Business No.' },
  { value: 'contractNumber', label: 'Contract No.' },
  { value: 'contractType', label: 'Type' },
  { value: 'numTimeReports', label: 'Time Reports' },
];

export { searchResultColumns };
