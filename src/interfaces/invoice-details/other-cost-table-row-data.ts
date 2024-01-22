export interface IOtherCostTableRowData {
  index: number;
  id: number;
  from: Date;
  to: Date;
  rateType: string | string[];
  unit: string | string[];
  ratePerUnit: number; //with $0.00 //Unit Cost
  numberOfUnits: number;
  cost: number;
  glAccountNumber: string;
  profitCentre: string;
  costCentre: string;
  internalOrder: string;
  fund: string;
  remarks: string;
  invoiceId: string;
}
