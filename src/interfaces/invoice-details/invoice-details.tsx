import { IDetailsTableRowData } from './details-table-row-data';

export default interface IInvoiceDetails {
  rateTypes: string[];
  rows: IDetailsTableRowData[];
}
