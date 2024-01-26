export interface IDetailsTableRowData {
  flightReportDate: Date;
  contractRegistrationName: string;
  flightReportId: number;
  aO02Number: string;
  rateType: string;
  noOfUnits: number;
  rateUnit: string;
  ratePerUnit: number; //with $0.00
  cost: number; //with $0.00
  account: number;
  profitCenter: string;
  costCenter: string;
  fireNumber: string;
  internalOrder: string;
  fund: string;
}
