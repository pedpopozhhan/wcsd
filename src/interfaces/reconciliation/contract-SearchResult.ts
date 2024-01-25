export class ContractSearchResult {
    index: number;
    vendorName: string;
    businessId: number;
    contractId: number;
    contractNumber: string;
    contractType: string;
    numTimeReports: number;
}

const contractSearchResultColumns: { value: string; label: string }[] = [
    { value: 'vendor', label: 'Vendor' },
    { value: 'businessId', label: 'Business No.' },
    { value: 'contractNumber', label: 'Contract No.' },
    { value: 'contractType', label: 'Type' },
    { value: 'numTimeReports', label: 'Time Reports' },
];

export { contractSearchResultColumns };