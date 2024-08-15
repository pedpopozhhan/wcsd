import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { IRowIndicator } from '@/interfaces/common/row-indicator.interface';

export interface IDetailsTableRow {
  index: number;
  data: ITimeReportDetailsTableRowData;
  isAdded: boolean;
  isSelected: boolean;
}
