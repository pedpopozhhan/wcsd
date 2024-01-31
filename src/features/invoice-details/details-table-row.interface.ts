import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

export interface IDetailsTableRow {
  index: number;
  data: IDetailsTableRowData;
  isAdded: boolean;
  isSelected: boolean;
}
