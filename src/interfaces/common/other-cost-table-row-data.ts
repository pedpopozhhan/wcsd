export interface IOtherCostTableRowData {
  index: number;
  from: Date;
  to: Date;
  rateType: string | string[];
  rateUnit: string | string[];
  ratePerUnit: number; //with $0.00 //Unit Cost
  noOfUnits: number;
  cost: number;
  account: string | string[];
  profitCentre: string | string[];
  costCentre: string | string[];
  internalOrder: string | string[];
  fund: string | string[];
  remarks: string;
  invoiceNumber: string;
}
