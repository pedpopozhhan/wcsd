export interface ITimeReportDetailsTableRowData {
  flightReportDate: Date;
  contractRegistrationName: string;
  flightReportId: number;
  aO02Number: string;
  rateType: string;
  noOfUnits: number;
  rateUnit: string;
  ratePerUnit: number; //with $0.00
  cost: number; //with $0.00
  glAcct: number;
  profitCenter: string;
  costCenter: string;
  fireNumber: string;
  internalOrder: string;
  fund: string;
}
