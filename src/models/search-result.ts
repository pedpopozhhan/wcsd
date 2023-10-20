export class SearchResult {
  vendor: string;
  businessId: number;
  contractId: number;
  type: number;
  numTimeReports: number;
}

const searchResultColumns: { value: string; label: string }[] = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'businessId', label: 'Business ID' },
  { value: 'contractId', label: 'Contract ID' },
  { value: 'type', label: 'Type' },
  { value: 'numTimeReports', label: 'Time Reports' },
];

export { searchResultColumns };
