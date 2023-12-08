export interface IDetailsTableRowData {
  date: Date;
  registrationNumber: string;
  reportNumber: number;
  aO02Number: string;
  rateType: string;
  numberOfUnits: number;
  rateUnit: string;
  ratePerUnit: number; //with $0.00
  cost: number; //with $0.00
  glAccountNumber: number;
  profitCentre: string;
  costCentre: string;
  fireNumber: string;
  internalOrder: string;
  fund: number;
}
