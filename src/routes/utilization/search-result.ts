export class SearchResult {
  vendorName: string;
  businessId: number;
  contractId: number;
  contractNumber: string;
  contractType: string;
  numTimeReports: number;
}

const searchResultColumns: { value: string; label: string }[] = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'businessId', label: 'Business ID' },
  { value: 'contractNumber', label: 'Contract ID' },
  { value: 'contractType', label: 'Type' },
  { value: 'numTimeReports', label: 'Time Reports' },
];

export { searchResultColumns };
