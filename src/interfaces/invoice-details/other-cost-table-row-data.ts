export interface IOtherCostTableRowData {
  recordid: number;
  from: Date;
  to: Date;
  rateType: string;
  unit: string;
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
