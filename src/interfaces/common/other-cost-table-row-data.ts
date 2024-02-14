export interface IOtherCostTableRowData {
  index: number;
  from: Date;
  to: Date;
  rateType: string | string[];
  unit: string | string[];
  ratePerUnit: number; //with $0.00 //Unit Cost
  numberOfUnits: number;
  cost: number;
  glAcct: string | string[];
  profitCentre: string | string[];
  costCentre: string | string[];
  internalOrder: string | string[];
  fund: string | string[];
  remarks: string;
  invoiceId: string;
}
