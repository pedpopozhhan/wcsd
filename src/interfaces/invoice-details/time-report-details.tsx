import { ITimeReportDetailsTableRowData } from './time-report-details-table-row-data';

export default interface ITimeReportDetails {
  rateTypes: string[];
  rows: ITimeReportDetailsTableRowData[];
}
