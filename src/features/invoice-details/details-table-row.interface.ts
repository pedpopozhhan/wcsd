import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

export interface IDetailsTableRow {
  index: number;
  data: ITimeReportDetailsTableRowData;
  isAdded: boolean;
  isSelected: boolean;
}
