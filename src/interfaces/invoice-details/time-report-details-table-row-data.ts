export interface ITimeReportDetailsTableRowData {
  flightReportDate: string;
  contractRegistrationName: string;
  flightReportId: number;
  ao02Number: string;
  rateType: string;
  noOfUnits: number;
  rateUnit: string;
  ratePerUnit: number; //with $0.00
  cost: number; //with $0.00
  account: number;
  profitCenter: string;
  costCenter: string;
  fireNumber: string;
  fireYear: string;
  internalOrder: string;
  fund: string;
}
